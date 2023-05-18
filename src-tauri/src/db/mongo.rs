use mongodb::{bson, options::ClientOptions, Client, Database};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::error::Error;

use crate::fungsi::rahasia;

#[derive(Serialize, Deserialize, Debug)]
pub struct Pengguna {
    nama: String,
    password: String,
    peran: String,
    departemen: String,
    email: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Parameter {
    pub tabel_bc: TabelBc,
    pub kolom_bc: KolomBc,
    pub argumen_bc: ArgumenBc,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TabelBc {
    pub jurnal_item_437: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct KolomBc {
    pub brand_dim: String,
    pub oricode: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ArgumenBc {
    pub item_service_prefix: String,
}

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

    let auth = bson::doc! {"nama": nama, "password": kata_kunci};

    if let Some(hasil) = koleksi_user.find_one(auth, None).await? {
        Ok(Some(hasil))
    } else {
        Ok(None)
    }
}

pub async fn param_bc() -> Result<Option<Parameter>, Box<dyn Error>>
where
    Parameter: DeserializeOwned + Unpin + Send + Sync,
{
    let database = bc_database().await?;
    let koleksi_parameter = database.collection(rahasia::KOLEKSI_PARAMETER);

    if let Some(document) = koleksi_parameter.find_one(None, None).await? {
        let parameter: Parameter = bson::from_document(document)?;

        Ok(Some(parameter))
    } else {
        Ok(None)
    }
}
