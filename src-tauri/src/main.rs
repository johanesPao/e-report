// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use polars::prelude::*;
use serde_json::{self, json};
use struktur::*;

use crate::db::mongo;
use crate::db::mssql;
use crate::fungsi::{kueri_bc, rahasia};

mod db;
mod fungsi;
mod struktur;

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
async fn kueri_sederhana(kueri: String) -> Result<String, String> {
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

#[tauri::command]
async fn handle_data_penjualan(set_kueri: Vec<Kueri<'_>>) -> Result<String, String> {
    let mut df_utama: DataFrame = DataFrame::default();
    let mut vektor_dataframe: Vec<DataFrame> = Vec::new();
    for kueri in set_kueri {
        println!("Melakukan kueri {}", kueri.judul);
        match kueri_bc::kueri_penjualan(kueri).await {
            Ok(hasil) => match hasil {
                HasilKueri::DataILEEnum(vektor_data) => {
                    // Konversi vektor struct hasil kueri ke dalam dataframe polars
                    println!("Konversi DataILE ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_ile = DataFrame::new(vektor_series).expect("Gagal membuat dataframe ILE");
                    df_utama = df_ile;
                    println!("{:?}", df_utama);
                }
                HasilKueri::DataSalespersonRegionILEEnum(vektor_data) => {
                    println!("Konversi DataSalespersonRegion ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_salespersonregion = DataFrame::new(vektor_series).expect("Gagal membuat dataframe salespersonregion");
                    println!("{:?}", df_salespersonregion);
                    vektor_dataframe.push(df_salespersonregion);
                }
                HasilKueri::DataTokoILEEnum(vektor_data) => {
                    println!("Konversi DataToko ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_toko = DataFrame::new(vektor_series).expect("Gagal membuat dataframe toko");
                    println!("{:?}", df_toko);
                    vektor_dataframe.push(df_toko);
                }
                HasilKueri::DataProdukILEEnum(vektor_data) => {
                    println!("Konversi DataProduk ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_produk = DataFrame::new(vektor_series).expect("Gagal membuat dataframe produk");
                    println!("{:?}", df_produk);
                    vektor_dataframe.push(df_produk);
                }
                HasilKueri::DataVatILEEnum(vektor_data) => {
                    println!("Konversi DataVAT ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_vat = DataFrame::new(vektor_series).expect("Gagal membuat dataframe VAT");
                    println!("{:?}", df_vat);
                    vektor_dataframe.push(df_vat);
                }
                HasilKueri::DataPromoILEEnum(vektor_data) => {
                    println!("Konversi DataPromo ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_promo = DataFrame::new(vektor_series).expect("Gagal membuat dataframe promo");
                    println!("{:?}", df_promo);
                    vektor_dataframe.push(df_promo);
                }
                HasilKueri::DataDiskonILEEnum(vektor_data) => {
                    println!("Konversi DataDiskon ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_diskon = DataFrame::new(vektor_series).expect("Gagal membuat dataframe diskon");
                    println!("{:?}", df_diskon);
                    vektor_dataframe.push(df_diskon);
                }
                HasilKueri::DataDokumenLainnyaILEEnum(vektor_data) => {
                    println!("Konversi DataDokumenLainnya ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_dok_lainnya = DataFrame::new(vektor_series).expect("Gagal membuat dataframe dokumen lainnya");
                    println!("{:?}", df_dok_lainnya);
                    vektor_dataframe.push(df_dok_lainnya);
                }
                HasilKueri::DataKuantitasILEEnum(vektor_data) => {
                    println!("Konversi DataKuantitas ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_kuantitas = DataFrame::new(vektor_series).expect("Gagal membuat dataframe kuantitas");
                    println!("{:?}", df_kuantitas);
                    vektor_dataframe.push(df_kuantitas);
                }
                HasilKueri::DataCPPUILEEnum(vektor_data) => {
                    println!("Konversi DataCPPU ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_cppu = DataFrame::new(vektor_series).expect("Gagal membuat dataframe CPPU");
                    println!("{:?}", df_cppu);
                    vektor_dataframe.push(df_cppu);
                }
                HasilKueri::DataRPPUILEEnum(vektor_data) => {
                    println!("Konversi DataRPPU ke polars");
                    let vektor_series = vektor_data.ke_series();
                    let df_rppu = DataFrame::new(vektor_series).expect("Gagal membuat dataframe RPPU");
                    println!("{:?}", df_rppu);
                    vektor_dataframe.push(df_rppu);
                }
            },
            Err(_) => {
                let _json = json!({"status": false, "konten": "Kesalahan dalam matching Enum dengan hasil kueri"}).to_string();
            }
        }
    }
    // join dataframe
    println!("{:?}", df_utama);
    println!("{:?}", vektor_dataframe);
    // Inisiasi df_gabung dari df_utama dan df_salespersonregion (vektor_dataframe[0])
    let mut df_gabung = df_utama.left_join(&vektor_dataframe[0], ["no_entry"], ["no_entry"]).expect("Gagal join df_ile dengan df_salespersonregion");
    // df_gabung dengan df_toko (vektor_dataframe[1]) [left_on "store_dim", right_on "kode_toko"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[1], ["store_dim"], ["kode_toko"]).expect("Gagal join df_gabung dengan df_toko");
    // df_gabung dengan df_produk (vektor_dataframe[2]) [left_on "oricode", right_on "oricode"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[2], ["oricode"], ["oricode"]).expect("Gagal join df_gabung dengan df_produk");
    // df_gabung dengan df_vat (vektor_datafrane[3]) [left_on "no_dokumen", right_on "no_dokumen"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[3], ["no_dokumen"], ["no_dokumen"]).expect("Gagal join df_gabung dengan df_vat");
    // df_gabung dengan df_promo (vektor_dataframe[4]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[4], ["no_entry"], ["no_entry"]).expect("Gagal join df_gabung dengan df_promo");
    // df_gabung dengan df_diskon (vektor_dataframe[5]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[5], ["no_entry"], ["no_entry"]).expect("Gagal join df_gabung dengan df_diskon");
    // df_gabung dengan df_dok_lainnya (vektor_dataframe[6]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[6], ["no_entry"], ["no_entry"]).expect("Gagal join df_gabung dengan df_dok_lainnya");
    // df_gabung dengan df_kuantitas (vektor_dataframe[7]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[7], ["no_entry"], ["no_entry"]).expect("Gagal join df_gabung dengan df_kuantitas");
    // df_gabung dengan df_cppu (vektor_dataframe[8]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[8], ["no_entry"], ["no_entry"]).expect("Gagal join df_gabung dengan df_cppu");
    // df_gabung dengan df_rppu (vektor_dataframe[9]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung.left_join(&vektor_dataframe[9], ["no_entry"], ["no_entry"]).expect("Gagal join df_gabung dengan df_rppu");
    println!("{:?}", df_gabung);
    Ok(json!({"status": true, "konten": "on progress"}).to_string())
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,
            cek_koneksi_bc,
            inisiasi_bc_ereport,
            kueri_sederhana,
            handle_data_penjualan
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
