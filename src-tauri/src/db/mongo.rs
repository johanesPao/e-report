use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, Document},
    options::ClientOptions,
    Client, Database,
};
use serde::de::DeserializeOwned;
use std::error::Error;

use crate::struktur::{
    InputItemKelayakanTokoBaru, InputItemUMRKelayakanTokoBaru, InputModel, LabelValueInputItem,
    Model, Pengguna,
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
        .expect("Gagal memuat data proposal dari mongodb");

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
