use chrono::NaiveDateTime;
use polars::prelude::*;
use serde::{ser::SerializeStruct, Deserialize, Serialize, Serializer};
use struct_field_names_as_array::FieldNamesAsArray;

#[derive(Serialize, Deserialize, Debug)]
pub struct Pengguna {
    pub nama: String,
    pub password: String,
    pub peran: String,
    pub departemen: String,
    pub email: String,
    pub comp: Vec<String>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataILE {
    pub no_entry: Option<i32>,
    pub post_date: Option<NaiveDateTime>,
    pub system_created_at: Option<NaiveDateTime>,
    pub store_dim: Option<String>,
    pub loc_code: Option<String>,
    pub no_dokumen: Option<String>,
    pub source_no: Option<String>,
    pub brand_dim: Option<String>,
    pub oricode: Option<String>,
    pub ukuran: Option<String>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataSalespersonRegionByILE {
    pub no_entry: Option<i32>,
    pub salesperson: Option<String>,
    pub region: Option<String>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataTokoByILE {
    pub kode_toko: Option<String>,
    pub toko: Option<String>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataProdukByILE {
    pub oricode: Option<String>,
    pub deskripsi_produk: Option<String>,
    pub warna: Option<String>,
    pub prod_div: Option<String>,
    pub prod_grp: Option<String>,
    pub prod_cat: Option<String>,
    pub period: Option<String>,
    pub season: Option<String>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataVatByILE {
    pub no_dokumen: Option<String>,
    pub ppn: Option<f32>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataPromoByILE {
    pub no_entry: Option<i32>,
    pub promo: Option<String>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataDiskonByILE {
    pub no_entry: Option<i32>,
    pub diskon: Option<f32>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataDokumenLainnyaByILE {
    pub no_entry: Option<i32>,
    pub no_dokumen_oth: Option<String>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataKuantitasByILE {
    pub no_entry: Option<i32>,
    pub kuantitas: Option<f32>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataCPPUByILE {
    pub no_entry: Option<i32>,
    pub cost_price_per_unit: Option<f32>,
    pub total_sales_at_retail_aft_vat: Option<f32>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataRPPUByILE {
    pub no_entry: Option<i32>,
    pub retail_price_per_unit: Option<f32>,
}

pub trait DataFrameSerial {
    fn ke_series(&self) -> Vec<Series>;
}

impl DataFrameSerial for Vec<DataILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_post_date = Vec::new();
        let mut vektor_system_created_at = Vec::new();
        let mut vektor_store_dim = Vec::new();
        let mut vektor_loc_code = Vec::new();
        let mut vektor_no_dokumen = Vec::new();
        let mut vektor_source_no = Vec::new();
        let mut vektor_brand_dim = Vec::new();
        let mut vektor_oricode = Vec::new();
        let mut vektor_ukuran = Vec::new();

        for baris in self {
            for kolom in 0..DataILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_post_date.push(baris.post_date),
                    2 => vektor_system_created_at.push(baris.system_created_at),
                    3 => vektor_store_dim.push(baris.store_dim.clone()),
                    4 => vektor_loc_code.push(baris.loc_code.clone()),
                    5 => vektor_no_dokumen.push(baris.no_dokumen.clone()),
                    6 => vektor_source_no.push(baris.source_no.clone()),
                    7 => vektor_brand_dim.push(baris.brand_dim.clone()),
                    8 => vektor_oricode.push(baris.oricode.clone()),
                    9 => vektor_ukuran.push(baris.ukuran.clone()),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_post_date.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_system_created_at.clone(),
                )),
                3 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_store_dim.clone(),
                )),
                4 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_loc_code.clone(),
                )),
                5 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_dokumen.clone(),
                )),
                6 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_source_no.clone(),
                )),
                7 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_brand_dim.clone(),
                )),
                8 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_oricode.clone(),
                )),
                9 => vektor_series.push(Series::new(
                    DataILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_ukuran.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataSalespersonRegionByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_salesperson = Vec::new();
        let mut vektor_region = Vec::new();

        for baris in self {
            for kolom in 0..DataSalespersonRegionByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_salesperson.push(baris.salesperson.clone()),
                    2 => vektor_region.push(baris.region.clone()),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataSalespersonRegionByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataSalespersonRegionByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataSalespersonRegionByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_salesperson.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataSalespersonRegionByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_region.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataTokoByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_kode_toko = Vec::new();
        let mut vektor_toko = Vec::new();

        for baris in self {
            for kolom in 0..DataTokoByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_kode_toko.push(baris.kode_toko.clone()),
                    1 => vektor_toko.push(baris.toko.clone()),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataTokoByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataTokoByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_kode_toko.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataTokoByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_toko.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataProdukByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_oricode = Vec::new();
        let mut vektor_deskripsi_produk = Vec::new();
        let mut vektor_warna = Vec::new();
        let mut vektor_prod_div = Vec::new();
        let mut vektor_prod_grp = Vec::new();
        let mut vektor_prod_cat = Vec::new();
        let mut vektor_period = Vec::new();
        let mut vektor_season = Vec::new();

        for baris in self {
            for kolom in 0..DataProdukByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_oricode.push(baris.oricode.clone()),
                    1 => vektor_deskripsi_produk.push(baris.deskripsi_produk.clone()),
                    2 => vektor_warna.push(baris.warna.clone()),
                    3 => vektor_prod_div.push(baris.prod_div.clone()),
                    4 => vektor_prod_grp.push(baris.prod_grp.clone()),
                    5 => vektor_prod_cat.push(baris.prod_cat.clone()),
                    6 => vektor_period.push(baris.period.clone()),
                    7 => vektor_season.push(baris.season.clone()),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataProdukByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataProdukByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_oricode.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataProdukByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_deskripsi_produk.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataProdukByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_warna.clone(),
                )),
                3 => vektor_series.push(Series::new(
                    DataProdukByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_div.clone(),
                )),
                4 => vektor_series.push(Series::new(
                    DataProdukByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_grp.clone(),
                )),
                5 => vektor_series.push(Series::new(
                    DataProdukByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_cat.clone(),
                )),
                6 => vektor_series.push(Series::new(
                    DataProdukByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_period.clone(),
                )),
                7 => vektor_series.push(Series::new(
                    DataProdukByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_season.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataVatByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_dokumen = Vec::new();
        let mut vektor_ppn = Vec::new();

        for baris in self {
            for kolom in 0..DataVatByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_dokumen.push(baris.no_dokumen.clone()),
                    1 => vektor_ppn.push(baris.ppn),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataVatByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataVatByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_dokumen.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataVatByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_ppn.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataPromoByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_promo = Vec::new();

        for baris in self {
            for kolom in 0..DataPromoByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_promo.push(baris.promo.clone()),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataPromoByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataPromoByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataPromoByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_promo.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataDiskonByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_diskon = Vec::new();

        for baris in self {
            for kolom in 0..DataDiskonByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_diskon.push(baris.diskon),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataDiskonByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataDiskonByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataDiskonByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_diskon.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataDokumenLainnyaByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_no_dokumen_oth = Vec::new();

        for baris in self {
            for kolom in 0..DataDokumenLainnyaByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_no_dokumen_oth.push(baris.no_dokumen_oth.clone()),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataDokumenLainnyaByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataDokumenLainnyaByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataDokumenLainnyaByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_dokumen_oth.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataKuantitasByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_kuantitas = Vec::new();

        for baris in self {
            for kolom in 0..DataKuantitasByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_kuantitas.push(baris.kuantitas),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataKuantitasByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataKuantitasByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataKuantitasByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_kuantitas.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataCPPUByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_cppu = Vec::new();
        let mut vektor_total_sales_at_retail_aft_vat = Vec::new();

        for baris in self {
            for kolom in 0..DataCPPUByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_cppu.push(baris.cost_price_per_unit),
                    2 => vektor_total_sales_at_retail_aft_vat
                        .push(baris.total_sales_at_retail_aft_vat),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataCPPUByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataCPPUByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataCPPUByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_cppu.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataCPPUByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_total_sales_at_retail_aft_vat.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl DataFrameSerial for Vec<DataRPPUByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_rppu = Vec::new();

        for baris in self {
            for kolom in 0..DataRPPUByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_rppu.push(baris.retail_price_per_unit),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataRPPUByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataRPPUByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataRPPUByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_rppu.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

// kita masih membutuhkan serialisasi hasil akhir, kecuali jika dataframe polars
// memiliki fitur serde json
// impl Serialize for DataILE {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: Serializer,
//     {
//         let mut data_penjualan = serializer.serialize_struct("DataILE", 10)?;
//         data_penjualan.serialize_field("no_entry", &self.no_entry)?;
//         data_penjualan.serialize_field("post_date", &self.post_date.map(|dt| dt.to_string()))?;
//         data_penjualan.serialize_field(
//             "system_created_at",
//             &self.system_created_at.map(|dt| dt.to_string()),
//         )?;
//         data_penjualan.serialize_field("store_dim", &self.store_dim)?;
//         data_penjualan.serialize_field("loc_code", &self.loc_code)?;
//         data_penjualan.serialize_field("no_dokumen", &self.no_dokumen)?;
//         data_penjualan.serialize_field("source_no", &self.source_no)?;
//         data_penjualan.serialize_field("brand_dim", &self.brand_dim)?;
//         data_penjualan.serialize_field("oricode", &self.oricode)?;
//         data_penjualan.serialize_field("ukuran", &self.ukuran)?;
//         data_penjualan.end()
//     }
// }

#[derive(Serialize, Deserialize, Debug)]
pub struct Kueri<'a> {
    pub judul: &'a str,
    pub kueri: &'a str,
}

pub enum HasilKueri {
    DataILEEnum(Vec<DataILE>),
    DataSalespersonRegionILEEnum(Vec<DataSalespersonRegionByILE>),
    DataTokoILEEnum(Vec<DataTokoByILE>),
    DataProdukILEEnum(Vec<DataProdukByILE>),
    DataVatILEEnum(Vec<DataVatByILE>),
    DataPromoILEEnum(Vec<DataPromoByILE>),
    DataDiskonILEEnum(Vec<DataDiskonByILE>),
    DataDokumenLainnyaILEEnum(Vec<DataDokumenLainnyaByILE>),
    DataKuantitasILEEnum(Vec<DataKuantitasByILE>),
    DataCPPUILEEnum(Vec<DataCPPUByILE>),
    DataRPPUILEEnum(Vec<DataRPPUByILE>),
}
