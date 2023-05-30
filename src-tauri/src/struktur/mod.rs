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
pub struct DataPenjualan {
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

pub trait DataFrameSerial {
    fn ke_serial(&self) -> Vec<Series>;
}

impl DataFrameSerial for Vec<DataPenjualan> {
    fn ke_serial(&self) -> Vec<Series> {
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
            for kolom in 0..DataPenjualan::FIELD_NAMES_AS_ARRAY.len() {
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
        for hitung in 0..DataPenjualan::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_post_date.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_system_created_at.clone(),
                )),
                3 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_store_dim.clone(),
                )),
                4 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_loc_code.clone(),
                )),
                5 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_dokumen.clone(),
                )),
                6 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_source_no.clone(),
                )),
                7 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_brand_dim.clone(),
                )),
                8 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_oricode.clone(),
                )),
                9 => vektor_series.push(Series::new(
                    DataPenjualan::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_ukuran.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        return vektor_series;
    }
}

impl Serialize for DataPenjualan {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut data_penjualan = serializer.serialize_struct("DataPenjualan", 10)?;
        data_penjualan.serialize_field("no_entry", &self.no_entry)?;
        data_penjualan.serialize_field("post_date", &self.post_date.map(|dt| dt.to_string()))?;
        data_penjualan.serialize_field(
            "system_created_at",
            &self.system_created_at.map(|dt| dt.to_string()),
        )?;
        data_penjualan.serialize_field("store_dim", &self.store_dim)?;
        data_penjualan.serialize_field("loc_code", &self.loc_code)?;
        data_penjualan.serialize_field("no_dokumen", &self.no_dokumen)?;
        data_penjualan.serialize_field("source_no", &self.source_no)?;
        data_penjualan.serialize_field("brand_dim", &self.brand_dim)?;
        data_penjualan.serialize_field("oricode", &self.oricode)?;
        data_penjualan.serialize_field("ukuran", &self.ukuran)?;
        data_penjualan.end()
    }
}
