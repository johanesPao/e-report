use bson::oid::ObjectId;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, to_document, Document},
    options::ClientOptions,
    Client, Database,
};
use serde::de::DeserializeOwned;
use serde_json::json;
use std::error::Error;

use crate::struktur::{
    ApprovalStatus, ApprovalTokoBaru, BuatProposalTokoBaru, InputItemKelayakanTokoBaru,
    InputItemUMRKelayakanTokoBaru, InputModel, KredensialPenggunaApprovalTokoBaru,
    LabelValueInputItem, Model, Pengguna,
};
use crate::{fungsi::rahasia, struktur::ProposalTokoBaru};

async fn buka_koneksi() -> Result<Option<Client>, Box<dyn Error>> {
    let mongo_url = rahasia::MONGODB_URL;
    let options = ClientOptions::parse(&mongo_url).await?;
    let koneksi_client = Client::with_options(options)?;

    Ok(Some(koneksi_client))
}

async fn bc_database() -> Result<Database, Box<dyn Error>> {
    if let Some(client) = buka_koneksi().await? {
        let database = client.database(rahasia::DATABASE);
        Ok(database)
    } else {
        Err(Box::new(mongodb::error::Error::from(std::io::Error::new(
            std::io::ErrorKind::Other,
            "Connection Error",
        ))))
    }
}

pub async fn autentikasi_user(
    nama: String,
    kata_kunci: String,
) -> Result<Option<Pengguna>, Box<dyn Error>>
where
    Pengguna: DeserializeOwned + Unpin + Send + Sync,
{
    let database = bc_database().await?;
    let koleksi_user: mongodb::Collection<_> = database.collection(rahasia::KOLEKSI_PENGGUNA);

    let auth = doc! {"nama": nama, "password": kata_kunci};

    if let Some(hasil) = koleksi_user.find_one(auth, None).await? {
        Ok(Some(hasil))
    } else {
        Ok(None)
    }
}

pub async fn get_all_proposal_toko_baru() -> Result<Option<Vec<ProposalTokoBaru>>, Box<dyn Error>> {
    let database = bc_database().await?;
    let koleksi_proposal = database.collection(rahasia::KOLEKSI_PROPOSAL_TOKO_BARU);

    let mut hasil_kueri = koleksi_proposal
        .find(None, None)
        .await
        .expect("Gagal memuat data proposal toko baru dari mongodb");

    // Iterasi cursor
    let mut kumpulan_proposal: Vec<ProposalTokoBaru> = Vec::new();
    while let Some(proposal) = hasil_kueri.try_next().await? {
        kumpulan_proposal.push(proposal);
    }

    // Kembalikan Option Some None jika Ok
    if kumpulan_proposal.len() > 0 {
        Ok(Some(kumpulan_proposal))
    } else {
        Ok(None)
    }
}

pub async fn get_all_approval_toko_baru() -> Result<Option<Vec<ApprovalTokoBaru>>, Box<dyn Error>> {
    let database = bc_database()
        .await
        .expect("Gagal membuka koneksi dengan database mongo");
    let koleksi_approval = database.collection(rahasia::KOLEKSI_APPROVAL_TOKO_BARU);

    let mut hasil_kueri = koleksi_approval
        .find(None, None)
        .await
        .expect("Gagal memuat data approval toko baru dari mongodb");

    // Iterasi cursor
    let mut kumpulan_approval: Vec<ApprovalTokoBaru> = Vec::new();
    while let Some(approval) = hasil_kueri.try_next().await? {
        kumpulan_approval.push(approval);
    }

    // Kembalikan Option Some None jika Ok
    if kumpulan_approval.len() > 0 {
        Ok(Some(kumpulan_approval))
    } else {
        Ok(None)
    }
}

pub async fn get_pengguna_approval_toko_baru(
    vektor_id: Vec<ObjectId>,
) -> Result<Option<Vec<KredensialPenggunaApprovalTokoBaru>>, Box<dyn Error>> {
    let database = bc_database()
        .await
        .expect("Gagal membuka koneksi dengan database mongo");
    let koleksi_pengguna: mongodb::Collection<Pengguna> =
        database.collection(rahasia::KOLEKSI_PENGGUNA);

    let pengguna = doc! {"_id": { "$in": vektor_id}};

    let mut hasil_kueri = koleksi_pengguna
        .find(pengguna, None)
        .await
        .expect("Gagal memuat data pengguna approval toko baru dari mongodb");

    // Iterasi cursor
    let mut kumpulan_pengguna: Vec<KredensialPenggunaApprovalTokoBaru> = Vec::new();
    while let Some(pengguna) = hasil_kueri.try_next().await? {
        let pengguna_terkueri = KredensialPenggunaApprovalTokoBaru {
            id: pengguna._id,
            nama: pengguna.nama,
            email: pengguna.email,
        };
        kumpulan_pengguna.push(pengguna_terkueri)
    }

    // Kembalikan Opton Some None jika Ok
    if kumpulan_pengguna.len() > 0 {
        Ok(Some(kumpulan_pengguna))
    } else {
        Ok(None)
    }
}

pub async fn buat_dokumen_approval_proposal_toko_baru(
    proposal_id: String,
    array_approver_id: Vec<String>,
) -> Result<String, String> {
    // konversi array_approver_id menjadi Vec<ApprovalStatus>
    let mut vektor_approver_obj_id = Vec::new();
    for approver_id in array_approver_id {
        let approver = ApprovalStatus {
            id: ObjectId::parse_str(&approver_id)
                .expect(format!("Gagal mengkonversi ObjekID {}", &approver_id).as_str()),
            status: 0,
        };
        vektor_approver_obj_id.push(approver);
    }

    // buat struct ApprovalTokoBaru
    let approval_baru = ApprovalTokoBaru {
        proposal_id: proposal_id,
        approval: vektor_approver_obj_id,
    };

    let database = bc_database()
        .await
        .expect("Gagal membuka koneksi dengan database mongo");
    let koleksi_approval: mongodb::Collection<ApprovalTokoBaru> =
        database.collection(rahasia::KOLEKSI_APPROVAL_TOKO_BARU);

    // tulis approval ke dalam koleksi approval
    let hasil = koleksi_approval
        .insert_one(approval_baru, None)
        .await
        .expect("Gagal memasukkan approval ke dalam koleksi approval");

    Ok(json!({"status": true, "konten": hasil.inserted_id.as_str()}).to_string())
}

pub async fn update_status_proposal_toko(
    proposal_id: String,
    versi: i32,
    status: i32,
) -> Result<(), Box<dyn Error>> {
    let database = bc_database()
        .await
        .expect("Gagal membuka koneksi dengan database mongo");
    let koleksi_proposal: mongodb::Collection<ProposalTokoBaru> =
        database.collection(rahasia::KOLEKSI_PROPOSAL_TOKO_BARU);

    let dokumen = doc! {"proposal_id": proposal_id, "versi": versi};
    let update = doc! {"$set": {"data.status": status}};

    koleksi_proposal
        .find_one_and_update(dokumen, update, None)
        .await
        .unwrap();

    Ok(())
}

pub async fn ambil_approval_proposal(
    proposal_id: &String,
) -> Result<Option<ApprovalTokoBaru>, Box<dyn Error>> {
    let database = bc_database()
        .await
        .expect("Gagal membuka koneksi dengan database mongo");
    let koleksi_approval: mongodb::Collection<ApprovalTokoBaru> =
        database.collection(rahasia::KOLEKSI_APPROVAL_TOKO_BARU);

    let filter = doc! {"proposal_id": &proposal_id};

    let hasil = koleksi_approval.find_one(filter, None)
        .await
        .expect(format!("Terjadi kesalahan pada kueri find_one untuk mendapatkan approval proposal dengan ID {}", proposal_id).as_str());

    Ok(hasil)
}

pub async fn update_status_approval_proposal(
    proposal_id: &String,
    id_approver: &ObjectId,
    status: &i32,
) -> Result<(), Box<dyn Error>> {
    let database = bc_database()
        .await
        .expect("Gagal membuka koneksi dengan database mongo");
    let koleksi_approval: mongodb::Collection<ApprovalTokoBaru> =
        database.collection(rahasia::KOLEKSI_APPROVAL_TOKO_BARU);

    let filter = doc! {"proposal_id": proposal_id, "approval.id": id_approver};
    let update = doc! {"$set": {"approval.$.status": status}};

    koleksi_approval.find_one_and_update(filter, update, None)
        .await
        .expect(format!("Gagal mengupdate status approval Proposal ID {proposal_id} untuk pengguna dengan Objek ID {}", id_approver.to_string()).as_str());

    Ok(())
}

pub async fn get_all_input_item_model_toko_baru(
) -> Result<Option<InputItemKelayakanTokoBaru>, Box<dyn Error>> {
    let database = bc_database().await?;
    let koleksi_model = database.collection::<Model>(rahasia::KOLEKSI_MODEL);
    let koleksi_statistik_nasional =
        database.collection::<InputItemUMRKelayakanTokoBaru>(rahasia::KOLEKSI_STATISTIK_NASIONAL);

    let mut filter = doc! { "latest": true};

    let hasil_kueri_model = koleksi_model
        .find_one(filter, None)
        .await
        .expect("Gagal memuat data input_item dari mongodb");

    let mut input_nama_model_url: String = "".to_string();
    let mut input_nama_model: String = "".to_string();
    let mut input_versi: String = "".to_string();
    let mut input_mean: String = "".to_string();
    let mut input_std: String = "".to_string();
    let mut input_item_sbu: Vec<String> = Vec::new();
    let mut input_item_rentang_populasi: Vec<LabelValueInputItem> = Vec::new();
    let mut input_item_kelas_mall: Vec<LabelValueInputItem> = Vec::new();
    if let Some(model) = hasil_kueri_model {
        input_nama_model_url = model.nama_model_url;
        input_nama_model = model.nama_model;
        input_versi = model.versi;
        input_mean = model.mean;
        input_std = model.std;
        input_item_sbu = model.sbu;
        input_item_rentang_populasi = model.rentang_populasi_er;
        input_item_kelas_mall = model.kelas_mall_er;
    }

    filter = doc! { "nama_data": "umr"};

    let mut hasil_kueri_umr = koleksi_statistik_nasional
        .find(filter, None)
        .await
        .expect("Gagal memuat data umr dari mongodb");

    let mut kumpulan_data_umr: Vec<InputItemUMRKelayakanTokoBaru> = Vec::new();
    while let Some(data_umr) = hasil_kueri_umr.try_next().await? {
        kumpulan_data_umr.push(data_umr);
    }

    if kumpulan_data_umr.len() > 0 {
        let input_item_final = InputItemKelayakanTokoBaru {
            sbu_item: input_item_sbu,
            rentang_populasi_item: input_item_rentang_populasi,
            kelas_mall_item: input_item_kelas_mall,
            umr_item: kumpulan_data_umr,
            model: InputModel {
                nama_model_url: input_nama_model_url,
                nama_model: input_nama_model,
                versi: input_versi,
                mean: input_mean,
                std: input_std,
            },
        };
        Ok(Some(input_item_final))
    } else {
        Ok(None)
    }
}

pub async fn param_bc() -> Result<Option<Document>, Box<dyn Error>> {
    let database = bc_database().await?;
    let koleksi_parameter = database.collection(rahasia::KOLEKSI_PARAMETER);

    let hasil_kueri = koleksi_parameter
        .find_one(None, None)
        .await
        .expect("Kesalahan");
    match hasil_kueri {
        Some(dokumen) => Ok(dokumen),
        None => Ok(None),
    }
}

pub async fn simpan_proposal(proposal: BuatProposalTokoBaru) -> Result<String, Box<dyn Error>> {
    let database = bc_database()
        .await
        .expect("Gagal membuka koneksi dengan server mongo");
    let koleksi_proposal = database.collection(rahasia::KOLEKSI_PROPOSAL_TOKO_BARU);
    let konversi_proposal = proposal.konversi_date_time();
    let dokumen = to_document(&konversi_proposal)
        .expect("Gagal merubah struct proposal menjadi dokumen BSON");
    koleksi_proposal
        .insert_one(dokumen, None)
        .await
        .expect("Gagal menambahkan proposal ke dalam koleksi proposal");
    Ok(json!({"status": true}).to_string())
}

pub async fn hapus_proposal_id(proposal_id: &str) -> Result<String, Box<dyn Error>> {
    let database = bc_database()
        .await
        .expect("Gagal membuka koneksi dengan server mongo");
    let koleksi_proposal =
        database.collection::<ProposalTokoBaru>(rahasia::KOLEKSI_PROPOSAL_TOKO_BARU);
    let filter = doc! {"proposal_id": proposal_id};
    let hasil_kueri = koleksi_proposal
        .delete_many(filter, None)
        .await
        .expect("Gagal menghapus proposal pada server mongo");
    Ok(json!({"status": true, "konten": hasil_kueri.deleted_count}).to_string())
}
