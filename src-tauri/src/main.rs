// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{self, json};

use crate::db::mongo;
use crate::db::mssql;
use crate::fungsi::{kueri_bc, rahasia};

mod db;
mod fungsi;

#[tauri::command]
async fn login(nama: String, kata_kunci: String) -> Result<String, String> {
    match mongo::autentikasi_user(nama, kata_kunci).await {
        Ok(Some(pengguna)) => {
            let json = serde_json::to_string(&pengguna).map_err(|e| e.to_string())?;
            Ok(json)
        }
        Ok(None) => Ok(r###"{}"###.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn cek_koneksi_bc() -> Result<String, String> {
    match mssql::cek_koneksi_bc(
        rahasia::BC_IP,
        rahasia::BC_PORT,
        rahasia::BC_USER,
        rahasia::BC_PWD,
        rahasia::BC_DB,
    )
    .await
    {
        Ok(_) => Ok(json!({"status": true, "konten": "BC dapat diakses"}).to_string()),
        Err(_) => Err(json!({"status": false, "konten": "BC tidak dapat diakses"}).to_string()),
    }
}

#[tauri::command]
async fn inisiasi_bc_ereport() -> Result<String, String> {
    match mongo::param_bc().await {
        Ok(Some(param)) => Ok(json!({"status": true, "konten": param}).to_string()),
        Ok(None) => Err(json!({"status": false, "konten": "Gagal memuat param"}).to_string()),
        Err(_) => Err(
            json!({"status": false, "konten": "Terjadi kesalahan pada koneksi dengan mongo"})
                .to_string(),
        ),
    }
}

#[tauri::command]
async fn kueri_data(kueri: String) -> Result<String, String> {
    match kueri_bc::kueri_umum(kueri).await {
        Ok(hasil) => {
            let json = json!({"status": true, "konten": hasil}).to_string();
            Ok(json)
        }
        Err(_) => {
            let json =
                json!({"status": false, "konten": "Kesalahan dalam memuat data"}).to_string();
            Err(json)
        }
    }
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,
            cek_koneksi_bc,
            inisiasi_bc_ereport,
            kueri_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
