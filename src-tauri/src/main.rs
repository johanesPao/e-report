// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use polars::prelude::*;
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
    rppu: bool,
    set_dimensi: Vec<Dimensi<'_>>,
    filter_data: Filter,
) -> Result<String, String> {
    // Konstruksi string contain untuk dimensi toko ke SBU
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
    let filter_prod_div = Series::new("filter_brand", filter_data.prod_div);
    let filter_prod_grp = Series::new("filter_brand", filter_data.prod_grp);
    let filter_prod_cat = Series::new("filter_brand", filter_data.prod_cat);
    let mut filter_sbu = Series::default();
    let mut filter_lokasi = Series::default();
    let mut filter_klasifikasi = Series::default();
    let mut filter_region = Series::default();
    if rppu {
        filter_sbu = Series::new("filter_brand", filter_data.sbu);
        filter_lokasi = Series::new("filter_brand", filter_data.lokasi);
    } else {
        filter_klasifikasi = Series::new("filter_brand", filter_data.klasifikasi);
        filter_region = Series::new("filter_brand", filter_data.region);
    }

    // KUERI PENJUALAN
    let mut df_utama: DataFrame = DataFrame::default();
    let mut vektor_dataframe: Vec<DataFrame> = Vec::new();
    for kueri in set_kueri {
        match kueri_bc::kueri_penjualan(kueri).await {
            Ok(hasil) => match hasil {
                HasilKueri::DataILEEnum(vektor_data) => {
                    // Konversi vektor struct hasil kueri ke dalam dataframe polars
                    let vektor_series = vektor_data.ke_series();
                    let df_ile =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe ILE");
                    df_utama = df_ile;
                }
                HasilKueri::DataSalespersonRegionILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_salespersonregion = DataFrame::new(vektor_series)
                        .expect("Gagal membuat dataframe salespersonregion");
                    vektor_dataframe.push(df_salespersonregion);
                }
                HasilKueri::DataTokoILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_toko =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe toko");
                    vektor_dataframe.push(df_toko);
                }
                HasilKueri::DataProdukILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_produk =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe produk");
                    vektor_dataframe.push(df_produk);
                }
                HasilKueri::DataVatILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_vat =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe VAT");
                    vektor_dataframe.push(df_vat);
                }
                HasilKueri::DataPromoILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_promo =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe promo");
                    vektor_dataframe.push(df_promo);
                }
                HasilKueri::DataDiskonILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_diskon =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe diskon");
                    vektor_dataframe.push(df_diskon);
                }
                HasilKueri::DataDokumenLainnyaILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_dok_lainnya = DataFrame::new(vektor_series)
                        .expect("Gagal membuat dataframe dokumen lainnya");
                    vektor_dataframe.push(df_dok_lainnya);
                }
                HasilKueri::DataKuantitasILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_kuantitas =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe kuantitas");
                    vektor_dataframe.push(df_kuantitas);
                }
                HasilKueri::DataCPPUILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_cppu =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe CPPU");
                    vektor_dataframe.push(df_cppu);
                }
                HasilKueri::DataKlasifikasiILEEnum(vektor_data) => {
                    let vektor_series = vektor_data.ke_series();
                    let df_klasifikasi =
                        DataFrame::new(vektor_series).expect("Gagal membuat dataframe klasifikasi");
                    vektor_dataframe.push(df_klasifikasi);
                }
                HasilKueri::DataRPPUILEEnum(vektor_data) => {
                    if rppu {
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
    if rppu {
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
        ])
        .unwrap();

    // let json = serde_json::Value(&df_gabung).unwrap();
    Ok(json!({"status": true, "konten": df_gabung}).to_string())
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
