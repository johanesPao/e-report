// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::collections::HashMap;

use polars::prelude::*;
use regex::Regex;
use serde_json::{self, json};

use crate::db::mongo;
use crate::db::mssql;
use crate::fungsi::{kueri_bc, rahasia};
use struktur::*;

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
async fn handle_data_penjualan(
    set_kueri: Vec<Kueri<'_>>,
    comp_pri: bool,
    set_dimensi: Vec<Dimensi<'_>>,
    filter_data: Filter,
    window: tauri::Window,
) -> Result<String, String> {
    // Konstruksi string contain untuk dimensi toko ke SBU
    window
        .emit(
            "data-penjualan",
            json!({"state": "start", "konten": "Parameter data diterima di Rust, pemetaan dimensi dilakukan"}),
        )
        .expect("Gagal emit notifikasi penerimaan parameter");
    let mut peta_dimensi_ecommerce: String = String::new();
    let mut peta_dimensi_fisik_sport: String = String::new();
    let mut peta_dimensi_fisik_football: String = String::new();
    let mut peta_dimensi_our_daily_dose: String = String::new();
    let mut peta_dimensi_wholesale: String = String::new();
    let mut peta_dimensi_bazaar_others: String = String::new();
    for dimensi in set_dimensi {
        match dimensi.sbu {
            "e-Commerce" => peta_dimensi_ecommerce = dimensi.dimensi.join("|"),
            "Fisik Sport" => peta_dimensi_fisik_sport = dimensi.dimensi.join("|"),
            "Fisik Football" => peta_dimensi_fisik_football = dimensi.dimensi.join("|"),
            "Our Daily Dose" => peta_dimensi_our_daily_dose = dimensi.dimensi.join("|"),
            "Wholesale" => peta_dimensi_wholesale = dimensi.dimensi.join("|"),
            "Bazaar (Others)" => peta_dimensi_bazaar_others = dimensi.dimensi.join("|"),
            _ => eprintln!("Dimensi::sbu tidak dikenal"),
        }
    }

    // Konstruksi series penampung filter_data
    let filter_brand = Series::new("filter_brand", filter_data.brand);
    let filter_prod_div = Series::new("filter_prod_div", filter_data.prod_div);
    let filter_prod_grp = Series::new("filter_prod_grp", filter_data.prod_grp);
    let filter_prod_cat = Series::new("filter_prod_cat", filter_data.prod_cat);
    let mut filter_sbu = Series::default();
    let mut filter_lokasi = Series::default();
    let mut filter_klasifikasi = Series::default();
    let mut filter_region = Series::default();
    if comp_pri {
        filter_sbu = Series::new("filter_sbu", filter_data.sbu.unwrap());
        filter_lokasi = Series::new("filter_lokasi", filter_data.lokasi.unwrap());
    } else {
        filter_klasifikasi = Series::new("filter_klasifikasi", filter_data.klasifikasi.unwrap());
        filter_region = Series::new("filter_region", filter_data.region.unwrap());
    }

    // KUERI PENJUALAN
    let mut df_utama: DataFrame = DataFrame::default();
    let mut vektor_dataframe: Vec<DataFrame> = Vec::new();
    for kueri in set_kueri {
        let konten = format!("Melakukan kueri dengan ID {}", kueri.judul);
        let gagal_emit_notif = format!("Gagal emit notifikasi kueri ID {}", kueri.judul);
        window
            .emit(
                "data-penjualan",
                json!({"state": "update", "konten": &konten}),
            )
            .expect(&gagal_emit_notif);
        match kueri_bc::kueri_penjualan(kueri).await {
            Ok(hasil) => match hasil {
                HasilKueriPenjualan::DataILEEnum(vektor_data) => {
                    // Konversi vektor struct hasil kueri ke dalam dataframe polars
                    let vektor_series = vektor_data.ke_series();
                    let df_ile =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe ILE");
                    df_utama = df_ile;
                }
                HasilKueriPenjualan::DataSalespersonRegionILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_salespersonregion = DataFrame::new(vektor_series)
                        .expect("Gagal membuat dataframe salespersonregion");
                    vektor_dataframe.push(df_salespersonregion);
                }
                HasilKueriPenjualan::DataTokoILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_toko =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe toko");
                    vektor_dataframe.push(df_toko);
                }
                HasilKueriPenjualan::DataProdukILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_produk =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe produk");
                    vektor_dataframe.push(df_produk);
                }
                HasilKueriPenjualan::DataVatILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_vat =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe VAT");
                    vektor_dataframe.push(df_vat);
                }
                HasilKueriPenjualan::DataPromoILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_promo =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe promo");
                    vektor_dataframe.push(df_promo);
                }
                HasilKueriPenjualan::DataDiskonILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_diskon =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe diskon");
                    vektor_dataframe.push(df_diskon);
                }
                HasilKueriPenjualan::DataDokumenLainnyaILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_dok_lainnya = DataFrame::new(vektor_series)
                        .expect("Gagal membuat dataframe dokumen lainnya");
                    vektor_dataframe.push(df_dok_lainnya);
                }
                HasilKueriPenjualan::DataKuantitasILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_kuantitas =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe kuantitas");
                    vektor_dataframe.push(df_kuantitas);
                }
                HasilKueriPenjualan::DataCPPUILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_cppu =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe CPPU");
                    vektor_dataframe.push(df_cppu);
                }
                HasilKueriPenjualan::DataKlasifikasiILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_klasifikasi =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe klasifikasi");
                    vektor_dataframe.push(df_klasifikasi);
                }
                HasilKueriPenjualan::DataRPPUILEEnum(vektor_data) => {
                    if comp_pri {
                        let vektor_series = vektor_data.ke_series();
                        let df_rppu =
                            DataFrame::new(vektor_series).expect("Gagal membuat dataframe RPPU");
                        vektor_dataframe.push(df_rppu);
                    };
                }
            },
            Err(_) => {
                let _ = json!({"status": false, "konten": "Kesalahan dalam matching Enum dengan hasil kueri"}).to_string();
            }
        }
    }

    // JOIN DATAFRAME
    // Inisiasi df_gabung dari df_utama dan df_salespersonregion (vektor_dataframe[0])
    window
        .emit(
            "data-penjualan",
            json!({
                "state": "update",
                "konten": "Mempersiapkan dataframe Polars..."
            }),
        )
        .expect("Gagal emit notifikasi persiapan dataframe Polars");
    let mut df_gabung = df_utama
        .left_join(&vektor_dataframe[0], ["no_entry"], ["no_entry"])
        .expect("Gagal join df_ile dengan df_salespersonregion");
    // df_gabung dengan df_toko (vektor_dataframe[1]) [left_on "store_dim", right_on "kode_toko"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[1], ["store_dim"], ["kode_toko"])
        .expect("Gagal join df_gabung dengan df_toko");
    // Pemetaan SBU berdasar dimensi_toko (store_dim)
    df_gabung = df_gabung
        .lazy()
        .with_column(
            when(
                col("store_dim")
                    .str()
                    .contains(lit(peta_dimensi_ecommerce), false),
            )
            .then(lit("e-Commerce"))
            .otherwise(
                when(
                    col("store_dim")
                        .str()
                        .contains(lit(peta_dimensi_fisik_sport), false),
                )
                .then(lit("Fisik Sport"))
                .otherwise(
                    when(
                        col("store_dim")
                            .str()
                            .contains(lit(peta_dimensi_fisik_football), false),
                    )
                    .then(lit("Fisik Football"))
                    .otherwise(
                        when(
                            col("store_dim")
                                .str()
                                .contains(lit(peta_dimensi_our_daily_dose), false),
                        )
                        .then(lit("Our Daily Dose"))
                        .otherwise(
                            when(
                                col("store_dim")
                                    .str()
                                    .contains(lit(peta_dimensi_wholesale), false),
                            )
                            .then(lit("Wholesale"))
                            .otherwise(
                                when(
                                    col("store_dim")
                                        .str()
                                        .contains(lit(peta_dimensi_bazaar_others), false),
                                )
                                .then(lit("Bazaar (Others)"))
                                .otherwise(lit("Dimensi Toko Tidak Dikenal")),
                            ),
                        ),
                    ),
                ),
            )
            .alias("sbu"),
        )
        .collect()
        .unwrap();
    // df_gabung dengan df_produk (vektor_dataframe[2]) [left_on "oricode", right_on "oricode"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[2], ["oricode"], ["oricode"])
        .expect("Gagal join df_gabung dengan df_produk");
    // df_gabung dengan df_vat (vektor_datafrane[3]) [left_on "no_dokumen", right_on "no_dokumen"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[3], ["no_dokumen"], ["no_dokumen"])
        .expect("Gagal join df_gabung dengan df_vat");
    // df_gabung dengan df_promo (vektor_dataframe[4]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[4], ["no_entry"], ["no_entry"])
        .expect("Gagal join df_gabung dengan df_promo");
    // df_gabung dengan df_diskon (vektor_dataframe[5]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[5], ["no_entry"], ["no_entry"])
        .expect("Gagal join df_gabung dengan df_diskon");
    // df_gabung dengan df_dok_lainnya (vektor_dataframe[6]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[6], ["no_entry"], ["no_entry"])
        .expect("Gagal join df_gabung dengan df_dok_lainnya");
    // df_gabung dengan df_kuantitas (vektor_dataframe[7]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[7], ["no_entry"], ["no_entry"])
        .expect("Gagal join df_gabung dengan df_kuantitas");
    // konversi kuantitas -1
    df_gabung = df_gabung
        .lazy()
        .with_column((col("kuantitas") * lit(-1)).alias("kuantitas"))
        .collect()
        .unwrap();
    // df_gabung dengan df_cppu (vektor_dataframe[8]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[8], ["no_entry"], ["no_entry"])
        .expect("Gagal join df_gabung dengan df_cppu");
    // df_gabung dengan df_klasifkasi (vektor_dataframe[9]) [left_on "no_entry", right_on "no_entry"]
    df_gabung = df_gabung
        .left_join(&vektor_dataframe[9], ["no_entry"], ["no_entry"])
        .expect("Gagal join df_gabung dengan df_klasifikasi");
    // filter brand, prod_div, prod_grp, prod_cat
    df_gabung = df_gabung
        .lazy()
        .filter(col("brand_dim").is_in(lit(filter_brand)))
        .collect()
        .unwrap();
    df_gabung = df_gabung
        .lazy()
        .filter(col("prod_div").is_in(lit(filter_prod_div)))
        .collect()
        .unwrap();
    df_gabung = df_gabung
        .lazy()
        .filter(col("prod_grp").is_in(lit(filter_prod_grp)))
        .collect()
        .unwrap();
    df_gabung = df_gabung
        .lazy()
        .filter(col("prod_cat").is_in(lit(filter_prod_cat)))
        .collect()
        .unwrap();
    // jika rppu true (PRI)
    // df_gabung dengan df_rppu (vektor_dataframe[10]) [left_on "no_entry", right_on "no_entry"]
    // filter sbu dan kode_toko
    if comp_pri {
        window
            .emit(
                "data-penjualan",
                json!({
                    "state": "update",
                    "konten": "Melakukan kalkulasi retail price per unit, total sales serta filtering SBU dan Kode Toko pada dataframe Polars..."
                })
            )
            .expect("Gagal emit notifikasi kalkulasi dataframe Polars");
        df_gabung = df_gabung
            .left_join(&vektor_dataframe[10], ["no_entry"], ["no_entry"])
            .expect("Gagal join df_gabung dengan df_rppu");
        // RETAIL PRICE PER UNIT AFT DISC
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("retail_price_per_unit") * (lit(1) - col("diskon")))
                    .alias("retail_price_per_unit_aft_disc"),
            )
            .collect()
            .unwrap();
        // RETAIL PRICE PER UNIT AFT VAT
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("retail_price_per_unit_aft_disc") / (lit(1) + col("ppn")))
                    .alias("retail_price_per_unit_aft_vat"),
            )
            .collect()
            .unwrap();
        // TOTAL SALES AT RETAIL
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("retail_price_per_unit") * col("kuantitas")).alias("total_sales_at_retail"),
            )
            .collect()
            .unwrap();
        // TOTAL SALES AT RETAUL AFT DISC
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("retail_price_per_unit_aft_disc") * col("kuantitas"))
                    .alias("total_sales_at_retail_aft_disc"),
            )
            .collect()
            .unwrap();
        // TOTAL SALES AT RETAIL AFT VAT
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("retail_price_per_unit_aft_vat") * col("kuantitas"))
                    .alias("total_sales_at_retail_aft_vat"),
            )
            .collect()
            .unwrap();
        // filter sbu dan kode_toko (lokasi)
        df_gabung = df_gabung
            .lazy()
            .filter(col("sbu").is_in(lit(filter_sbu)))
            .collect()
            .unwrap();
        df_gabung = df_gabung
            .lazy()
            .filter(col("loc_code").is_in(lit(filter_lokasi)))
            .collect()
            .unwrap();
    // jika rppu false (PNT), deduksi mundur semua komponen sales at retail dari total_sales_at_retail_aft_ppn
    // filter klasifikasi dan region
    } else {
        window
            .emit(
                "data-penjualan",
            json!({
                "state": "update",
                "konten": "Mendeteksi comp non PRI, melakukan kalkulasi mundur Retail Price dari Total Sales at Retail Aft. VAT serta filtering Klasifikasi dan Region pada dataframe Polars..."
            })
        )
        .expect("Gagal emit notifikasi kalkulasi mundur pada dataframe Polars");
        // TOTAL SALES AT RETAIL AFT DISC
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("total_sales_at_retail_aft_vat") * (lit(1) + col("ppn")))
                    .alias("total_sales_at_retail_aft_disc"),
            )
            .collect()
            .unwrap();
        // TOTAL SALES AT RETAIL
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("total_sales_at_retail_aft_disc") / (lit(1) - col("diskon")))
                    .alias("total_sales_at_retail"),
            )
            .collect()
            .unwrap();
        // RETAIL PRICE PER UNIT AFT VAT
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("total_sales_at_retail_aft_vat") / col("kuantitas"))
                    .alias("retail_price_per_unit_aft_vat"),
            )
            .collect()
            .unwrap();
        // RETAIL PRICE PER UNIT AFT DISC
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("total_sales_at_retail_aft_disc") / col("kuantitas"))
                    .alias("retail_price_per_unit_aft_disc"),
            )
            .collect()
            .unwrap();
        // RETAIL PRICE PER UNIT
        df_gabung = df_gabung
            .lazy()
            .with_column(
                (col("total_sales_at_retail") / col("kuantitas")).alias("retail_price_per_unit"),
            )
            .collect()
            .unwrap();
        // filter klasifikasi dan region
        df_gabung = df_gabung
            .lazy()
            .filter(col("classification").is_in(lit(filter_klasifikasi)))
            .collect()
            .unwrap();
        df_gabung = df_gabung
            .lazy()
            .filter(col("region").is_in(lit(filter_region)))
            .collect()
            .unwrap();
    }
    window
        .emit(
            "data-penjualan",
            json!({
                "state": "update",
                "konten": "Melakukan kalkulasi Total Sales at Cost dan Margin pada dataframe Polars..."
            })
        )
        .expect("Gagal emit notifikasi cost dan margin pada polars");
    // TOTAL SALES AT COST
    df_gabung = df_gabung
        .lazy()
        .with_column((col("cost_price_per_unit") * col("kuantitas")).alias("total_sales_at_cost"))
        .collect()
        .unwrap();
    // TOTAL MARGIN AFT PPN (RP)
    df_gabung = df_gabung
        .lazy()
        .with_column(
            (col("total_sales_at_retail_aft_vat") - col("total_sales_at_cost"))
                .alias("total_margin_aft_vat_rp"),
        )
        .collect()
        .unwrap();
    // TOTAL MARGIN AFT PPN (%)
    df_gabung = df_gabung
        .lazy()
        .with_column(
            (when(col("total_sales_at_retail_aft_vat").lt_eq(0))
                .then(lit(0))
                .otherwise(col("total_margin_aft_vat_rp") / col("total_sales_at_retail_aft_vat")))
            .alias("total_margin_aft_vat_persen"),
        )
        .collect()
        .unwrap();
    // TOTAL BRUTO AFT PPN
    df_gabung = df_gabung
        .lazy()
        .with_column(
            (col("total_sales_at_retail") / (lit(1) + col("ppn"))).alias("total_bruto_aft_vat"),
        )
        .collect()
        .unwrap();

    window
        .emit(
            "data-penjualan",
            json!({
                "state": "update",
                "konten": "Menghapus kolom store_dim dan reordering kolom pada dataframe Polars..."
            }),
        )
        .expect("Gagal emit notifikasi hapus dan reorder kolom");
    // HAPUS KOLOM store_dim
    df_gabung = df_gabung.drop("store_dim").unwrap();
    // REORDER DATAFRAME
    df_gabung = df_gabung
        .select([
            "no_entry",
            "post_date",
            "system_created_at",
            "sbu",
            "loc_code",
            "toko",
            "no_dokumen",
            "no_dokumen_oth",
            "source_no",
            "classification",
            "salesperson",
            "region",
            "brand_dim",
            "oricode",
            "ukuran",
            "deskripsi_produk",
            "warna",
            "prod_div",
            "prod_grp",
            "prod_cat",
            "period",
            "season",
            "ppn",
            "promo",
            "diskon",
            "kuantitas",
            "cost_price_per_unit",
            "retail_price_per_unit",
            "retail_price_per_unit_aft_disc",
            "retail_price_per_unit_aft_vat",
            "total_sales_at_retail",
            "total_sales_at_retail_aft_disc",
            "total_sales_at_retail_aft_vat",
            "total_sales_at_cost",
            "total_margin_aft_vat_rp",
            "total_margin_aft_vat_persen",
            "total_bruto_aft_vat",
        ])
        .unwrap();

    // emit selesai
    window
        .emit(
            "data-penjualan", 
            json!({"state": "finish", "konten": "Proses pengolahan data penjualan pada Rust selesai, data ditransfer ke React untuk proses pemetaan ke tabel. Mohon tunggu sebentar..."})
        )
        .expect("Gagal emit notifikasi pemrosesan data penjualan selesai");
    // let json = serde_json::Value(&df_gabung).unwrap();
    Ok(json!({"status": true, "konten": df_gabung}).to_string())
}

#[tauri::command]
async fn handle_data_penerimaan_barang(
    set_kueri: Vec<Kueri<'_>>,
    filter_data: Filter,
    window: tauri::Window,
) -> Result<String, String> {
    // Konstruksi series untuk penampung filter_data
    window
        .emit(
            "data-penerimaan-barang",
            json!({"state": "start", "konten": "Parameter data diterima di Rust, rekonstruksi filter dilakukan"})
        )
        .expect("Gagal emit notifikasi penerimaan parameter");
    let filter_brand = Series::new("filter_brand", filter_data.brand);
    let filter_prod_div = Series::new("filter_prod_div", filter_data.prod_div);
    let filter_prod_grp = Series::new("filter_prod_grp", filter_data.prod_grp);
    let filter_prod_cat = Series::new("filter_prod_cat", filter_data.prod_cat);
    let filter_lokasi = Series::new("filter_lokasi", filter_data.lokasi.unwrap());

    // KUERI PENERIMAAN BARANG
    let mut df_utama: DataFrame = DataFrame::default();
    for kueri in set_kueri {
        let konten = format!("Melakukan kueri dengan ID {}", kueri.judul);
        let gagal_emit_notif = format!("Gagal emit notifikasi kueri ID {}", kueri.judul);
        window
            .emit(
                "data-penerimaan-barang",
                json!({"state": "update", "konten": &konten}),
            )
            .expect(&gagal_emit_notif);
        match kueri_bc::kueri_penerimaan_barang(kueri).await {
            Ok(hasil) => match hasil {
                HasilKueriPenerimaanBarang::DataPenerimaanBarangEnum(vektor_data) => {
                    // Konversi vektor struct hasil kueri ke dalam dataframe polars
                    let vektor_series = vektor_data.ke_series();
                    df_utama = DataFrame::new(vektor_series)
                        .expect("Gagal membuat dataframe utama penerimaan barang");
                }
            },
            Err(_) => {
                let _ = json!({"status": false, "konten": "Kesalahan dalam matching Enum dengan hasil kueri"}).to_string();
            }
        }
    }

    // FILTER DATAFRAME
    window
        .emit(
            "data-penerimaan-barang",
            json!({
                "state": "update",
                "konten": "Melakukan filtering pada dataframe polars"
            }),
        )
        .expect("Gagal emit notifikasi filtering dataframe polars penerimaan barang");
    df_utama = df_utama
        .lazy()
        .filter(col("brand_dim").is_in(lit(filter_brand)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_div").is_in(lit(filter_prod_div)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_grp").is_in(lit(filter_prod_grp)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_cat").is_in(lit(filter_prod_cat)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("loc_code").is_in(lit(filter_lokasi)))
        .collect()
        .unwrap();
    window
        .emit(
            "data-penerimaan-barang",
            json!({
                "state": "finish",
                "konten": "Proses penarikan data penerimaan barang pada Rust selesai, data ditransfer ke React untuk proses pemetaan ke tabel. Mohon tunggu sebentar..."
            })
        )
        .expect("Gagal emit notifikasi penarikan data penerimaan barang selesai");
    Ok(json!({"status": true, "konten": df_utama}).to_string())
}

#[tauri::command]
async fn handle_data_stok(
    set_kueri: Vec<Kueri<'_>>,
    filter_data: Filter,
    window: tauri::Window,
) -> Result<String, String> {
    // Konstruksi series untuk penampung filter_data
    window
        .emit(
            "data-stok",
            json!({"state": "start", "konten": "Parameter data diterima di Rust, rekonstruksi filter dilakukan"})
        )
        .expect("Gagal emit notifikasi penerimaan parameter");
    let filter_brand = Series::new("filter_brand", filter_data.brand);
    let filter_prod_div = Series::new("filter_prod_div", filter_data.prod_div);
    let filter_prod_grp = Series::new("filter_prod_cat", filter_data.prod_grp);
    let filter_prod_cat = Series::new("filter_prod_cat", filter_data.prod_cat);
    let filter_lokasi = Series::new("filter_lokasi", filter_data.lokasi.unwrap());

    // KUERI STOK
    let mut df_utama: DataFrame = DataFrame::default();
    for kueri in set_kueri {
        let konten = format!("Melakukan kueri dengan ID {}", kueri.judul);
        let gagal_emit_notif = format!("Gagal emit notifikasi kueri ID {}", kueri.judul);
        window
            .emit("data-stok", json!({"state": "update", "konten": &konten}))
            .expect(&gagal_emit_notif);
        match kueri_bc::kueri_stok(kueri).await {
            Ok(hasil) => match hasil {
                HasilKueriStok::DataStokEnum(vektor_data) => {
                    // Konversi vektor struct hasil kueri ke dalam dataframe polars
                    let vektor_series = vektor_data.ke_series();
                    df_utama =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe utama stok");
                }
            },
            Err(_) => {
                let _ = json!({"status": false, "konten": "Kesalahan dalam matching Enum dengan hasil kueri"}).to_string();
            }
        }
    }

    // FILTER DATAFRAME
    window
        .emit(
            "data-stok",
            json!({
                "state": "update",
                "konten": "Melakukan filtering pada dataframe polars"
            }),
        )
        .expect("Gagal emit notifikasi filtering dataframe polars stok");
    df_utama = df_utama
        .lazy()
        .filter(col("brand_dim").is_in(lit(filter_brand)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_div").is_in(lit(filter_prod_div)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_grp").is_in(lit(filter_prod_grp)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_cat").is_in(lit(filter_prod_cat)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("loc_code").is_in(lit(filter_lokasi)))
        .collect()
        .unwrap();
    window
        .emit(
            "data-stok",
            json!({
                "state": "finish",
                "konten": "Proses penarikan data stok pada Rust selesai, data ditransfer ke React untuk proses pemetaan ke tabel. Mohon tunggu sebentar..."
            })
        )
        .expect("Gagal emit notifikasi penarikan data stok selesai");

    Ok(json!({ "status": true, "konten": df_utama }).to_string())
}

#[tauri::command]
async fn handle_data_ketersediaan_stok(
    set_kueri: Vec<Kueri<'_>>,
    filter_data: Filter,
    window: tauri::Window,
) -> Result<String, String> {
    // Konstruksi series untuk penampung filter_data
    window
        .emit(
            "data-ketersediaan-stok",
            json!({"state": "start", "konten": "Parameter data diterima di Rust, rekonstruksi filter dilakukan"})
        )
        .expect("Gagal emit notifikasi penerimaan parameter");
    let filter_brand = Series::new("filter_brand", filter_data.brand);
    let filter_prod_div = Series::new("filter_prod_div", filter_data.prod_div);
    let filter_prod_grp = Series::new("filter_prod_cat", filter_data.prod_grp);
    let filter_prod_cat = Series::new("filter_prod_cat", filter_data.prod_cat);
    let filter_lokasi = Series::new("filter_lokasi", filter_data.lokasi.unwrap());

    // KUERI KETERSEDIAAN STOK
    let mut df_utama: DataFrame = DataFrame::default();
    for kueri in set_kueri {
        let konten = format!("Melakukan kueri dengan ID {}", kueri.judul);
        let gagal_emit_notif = format!("Gagal emit notifikasi kueri ID {}", kueri.judul);
        window
            .emit(
                "data-ketersediaan-stok",
                json!({"state": "update", "konten": &konten}),
            )
            .expect(&gagal_emit_notif);
        match kueri_bc::kueri_ketersediaan_stok(kueri).await {
            Ok(hasil) => match hasil {
                HasilKueriKetersediaanStok::DataKetersediaanStokEnum(vektor_data) => {
                    // Konversi vektor struct hasil kueri ke dalam dataframe polars
                    let vektor_series = vektor_data.ke_series();
                    df_utama =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe utama stok");
                }
            },
            Err(_) => {
                let _ = json!({"status": false, "konten": "Kesalahan dalam matching Enum dengan hasil kueri"}).to_string();
            }
        }
    }

    // FILTER DATAFRAME
    window
        .emit(
            "data-ketersediaan-stok",
            json!({
                "state": "update",
                "konten": "Melakukan filtering pada dataframe polars"
            }),
        )
        .expect("Gagal emit notifikasi filtering dataframe polars stok");
    df_utama = df_utama
        .lazy()
        .filter(col("brand_dim").is_in(lit(filter_brand)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_div").is_in(lit(filter_prod_div)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_grp").is_in(lit(filter_prod_grp)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("prod_cat").is_in(lit(filter_prod_cat)))
        .collect()
        .unwrap();
    df_utama = df_utama
        .lazy()
        .filter(col("loc_code").is_in(lit(filter_lokasi)))
        .collect()
        .unwrap();
    window
        .emit(
            "data-ketersediaan-stok",
            json!({
                "state": "finish",
                "konten": "Proses penarikan data stok pada Rust selesai, data ditransfer ke React untuk proses pemetaan ke tabel. Mohon tunggu sebentar..."
            })
        )
        .expect("Gagal emit notifikasi penarikan data stok selesai");

    Ok(json!({ "status": true, "konten": df_utama }).to_string())
}

#[tauri::command]
async fn handle_data_laba_rugi_toko(
    set_kueri: Vec<Kueri<'_>>,
    window: tauri::Window,
) -> Result<String, String> {
    // Konstruksi series untuk penampung filter_data
    window
        .emit(
            "data-laba-rugi-toko",
            json!({"state": "start", "konten": "Parameter data diterima di Rust"}),
        )
        .expect("Gagal emit notifikasi penerimaan parameter");

    // KUERI LABA RUGI TOKO
    let mut df_utama: DataFrame = DataFrame::default();
    for kueri in set_kueri {
        let konten = format!("Melakukan kueri dengan ID {}", kueri.judul);
        let gagal_emit_notif = format!("Gagal emit notifikasi kueri ID {}", kueri.judul);
        window
            .emit(
                "data-laba-rugi-toko",
                json!({"state": "update", "konten": &konten}),
            )
            .expect(&gagal_emit_notif);
        match kueri_bc::kueri_laba_rugi_toko(kueri).await {
            Ok(hasil) => match hasil {
                HasilKueriLabaRugiToko::DataLabaRugiTokoEnum(vektor_data) => {
                    // Konversi vektor struct hasil kueri ke dalam dataframe polars
                    let vektor_series = vektor_data.ke_series();
                    df_utama = DataFrame::new(vektor_series)
                        .expect("Gagal membuat dataframe utama penerimaan barang");
                }
            },
            Err(_) => {
                let _ = json!({"status": false, "konten": "Kesalahan dalam matching Enum dengan hasil kueri"}).to_string();
            }
        }
    }

    window
        .emit(
            "data-laba-rugi-toko",
            json!({
                "state": "finish",
                "konten": "Proses penarikan data laba rugi toko pada Rust selesai, data ditransfer ke React untuk proses pemetaan ke tabel. Mohon tunggu sebentar..."
            })
        )
        .expect("Gagal emit notifikasi penarikan data laba rugi toko selesai");
    Ok(json!({"status": true, "konten": df_utama}).to_string())
}

#[tauri::command]
async fn ambil_semua_proposal_toko_baru() -> Result<String, String> {
    match mongo::get_all_proposal_toko_baru().await {
        Ok(Some(kumpulan_proposal)) => {
            let json = serde_json::to_string(&kumpulan_proposal).map_err(|e| e.to_string())?;
            Ok(json)
        }
        Ok(None) => Ok(r###"{}"###.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn ambil_input_item_model_kelayakan_toko_baru() -> Result<String, String> {
    match mongo::get_all_input_item_model_toko_baru().await {
        Ok(Some(kumpulan_input_item)) => {
            let json = serde_json::to_string(&kumpulan_input_item).map_err(|e| e.to_string())?;
            Ok(json)
        }
        Ok(None) => Ok(r###"{}"###.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn kueri_kota_kabupaten_chatgpt(
    klien_konfig: KlienKonfigChatGPT,
    kueri: KotaKabupatenPopulasiProvinsiKontenChatGPT,
    list_provinsi: Vec<String>,
) -> Result<String, String> {
    // cek kota kabupaten eksis
    let hasil_kueri = match fungsi::ai::kueri(&klien_konfig, kueri.kota_eksis).await {
        // jika kota kabupaten eksis
        Ok(kota_eksis) => {
            if kota_eksis.as_str() == "True" {
                // kueri populasi kota kabupaten ke ChatGPT
                let hasil_populasi = match fungsi::ai::kueri(&klien_konfig, kueri.populasi_kota_kabupaten).await {
                    Ok(respon_populasi) => {
                        // ekstrak angka populasi dari respon chatGPT
                        let regex_populasi = Regex::new(r"\w[0-9.,]*\|[0-9]*").unwrap();
                        let kecocokan = match regex_populasi.find(respon_populasi.as_str()) {
                            // regex menemukan kecocokan
                            Some(populasi_tahun) => {
                                let populasi = populasi_tahun.as_str().split("|").collect::<Vec<_>>()[0];
                                HasilChatGPT {
                                    status: true,
                                    konten: populasi.to_string()
                                }
                            },
                            None => HasilChatGPT {
                                status: false,
                                konten: format!("Tidak berhasil mengekstrak angka populasi dari respon ChatGPT")
                            }
                        };
                        kecocokan
                    }
                    Err(e) => HasilChatGPT {
                        status: false,
                        konten: format!("Terjadi kesalahan saat melakukan kueri ChatGPT untuk populasi kota kabupaten: {}", e)
                    }
                };
                let hasil_provinsi = match fungsi::ai::kueri(&klien_konfig, kueri.provinsi_kota_kabupaten).await {
                    Ok(respon_provinsi) => {
                        // cek jika provinsi ada dalam list_provinsi
                        if list_provinsi.iter().any(|provinsi| provinsi == &respon_provinsi) {
                            // set HasilChatGPT true
                            HasilChatGPT {
                                status: true,
                                konten: respon_provinsi
                            }
                        } else {
                            // set HasilChatGPT false
                            HasilChatGPT {
                                status: false,
                                konten: format!("Tidak berhasil menemukan provinsi kota kabupaten dalam respon ChatGPT")
                            }
                        }
                    },
                    Err(e) => HasilChatGPT {
                        status: false,
                        konten: format!("Terjadi kesalahan saat melakukan kueri ChatGPT untuk provinsi kota kabupaten: {}", e)}
                };
                Ok(json!({"status": true, "konten": HasilKotaKabupatenChatGPT {
                        populasi_kota_kabupaten: hasil_populasi,
                    provinsi_kota_kabupaten: hasil_provinsi
                }})
                .to_string())
            } else {
                Ok(json!({"status": false, "konten": "ChatGPT tidak mengenali nama kota/kabupaten"}).to_string())
            }
        } 
        Err(e) => {
              Err(json!({"status": false, "konten": format!("Terjadi kesalahan saat melakukan kueri ChatGPT: {}", e)}).to_string())
          }
    };
    Ok(hasil_kueri?)
}

#[tauri::command]
async fn prediksi_penjualan_toko_baru(instance: Vec<f32>, model_url: String) -> Result<String, String> {
    println!("{:?}", instance);
    println!("{}", model_url);
    let mut input_instance = HashMap::new();
    input_instance.insert("instances", vec![instance]);
    // let input = InputPrediksiPenjualanTokoBaru {
    //     instances: Vec::from(instance)
    // };
    let klien = reqwest::Client::new();
    let respon = klien.post(model_url)
        .json(&input_instance)
        .send()
        .await
        .expect("Gagal melakukan komunikasi dengan model endpoint");
    if respon.status().is_success() {
        let konten = respon.text().await.expect("Gagal membaca respon body");
        Ok(json!({"status": true, "konten": konten}).to_string())
    } else {
        Err(json!({"status": false, "konten": "Respon status bukan 200"}).to_string())
    }
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,
            cek_koneksi_bc,
            inisiasi_bc_ereport,
            kueri_sederhana,
            handle_data_penjualan,
            handle_data_penerimaan_barang,
            handle_data_stok,
            handle_data_ketersediaan_stok,
            handle_data_laba_rugi_toko,
            ambil_semua_proposal_toko_baru,
            ambil_input_item_model_kelayakan_toko_baru,
            kueri_kota_kabupaten_chatgpt,
            prediksi_penjualan_toko_baru
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
