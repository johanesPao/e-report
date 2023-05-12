use mongodb::{bson, Client, Database};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::env;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
pub struct Pengguna {
    nama: String,
    password: String,
    peran: String,
    departemen: String,
    email: String
}

fn muat_env(file: PathBuf) -> String {
    match dotenvy::from_path(file) {
        Ok(_) => match dotenvy::var("MONGODB_URL") {
            Ok(url) => url,
            Err(e) => {
                println!("Error: {}", e);
                format!("Error")
            }
        },
        Err(e) => {
          println!("Error: {}", e);
          format!("Error")
        }
    }
}

async fn buka_koneksi() -> Option<Client> {
    let mut path = env::current_dir().unwrap();
    path.push("rust.env");
    let mongo_url = muat_env(path);
    if mongo_url != "Error" {
        let koneksi_client = Client::with_uri_str(String::from(mongo_url)).await;
        match koneksi_client {
            Ok(client) => Some(client),
            Err(_) => None,
        }
    } else {
        None
    }
}

async fn bc_database() -> Result<Database, mongodb::error::Error> {
    if let Some(client) = buka_koneksi().await {
        let database = client.database(&"bc".to_string());
        Ok(database)
    } else {
        Err(mongodb::error::Error::from(std::io::Error::new(
            std::io::ErrorKind::Other,
            "Connection Error",
        )))
    }
}

pub async fn autentikasi_user(
    nama: String,
    kata_kunci: String,
) -> Result<Option<Pengguna>, mongodb::error::Error>
where
    Pengguna: DeserializeOwned + Unpin + Send + Sync,
{
    let database = bc_database().await?;
    let koleksi_user: mongodb::Collection<_> = database.collection("pengguna");

    let auth = bson::doc! {"nama": nama, "password": kata_kunci};

    match koleksi_user.find_one(Some(auth), None).await? {
        Some(hasil) => {
            let pengguna = bson::from_bson(bson::Bson::Document(hasil))?;
            Ok(Some(pengguna))
        }
        None => Ok(None),
    }
}
