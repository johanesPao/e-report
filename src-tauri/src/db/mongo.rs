use mongodb::{
    bson::{self, Document},
    options::ClientOptions,
    Client, Database,
};
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
    comp: Vec<String>,
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
