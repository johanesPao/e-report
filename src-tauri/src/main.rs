// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json;
mod db;
mod fungsi;

#[tauri::command]
async fn login(nama: String, kata_kunci: String) -> Result<String, String> {
    match db::mongo::autentikasi_user(nama, kata_kunci).await {
        Ok(Some(pengguna)) => {
            let json = serde_json::to_string(&pengguna).map_err(|e| e.to_string())?;
            Ok(json)
        },
        Ok(None) => Ok(r###"{}"###.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tokio::main]
async fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![login])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
