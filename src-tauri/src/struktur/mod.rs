use chrono::NaiveDateTime;
use mongodb::bson::DateTime;
use polars::prelude::*;
use serde::{Deserialize, Deserializer, Serialize};
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

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataKlasifikasiByILE {
    pub no_entry: Option<i32>,
    pub classification: Option<String>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataPenerimaanBarang {
    pub no_entry: Option<i32>,
    pub post_date: Option<NaiveDateTime>,
    pub no_dokumen_pr: Option<String>,
    pub no_dokumen_wr: Option<String>,
    pub no_dokumen_po: Option<String>,
    pub loc_code: Option<String>,
    pub brand_dim: Option<String>,
    pub oricode: Option<String>,
    pub deskripsi_produk: Option<String>,
    pub warna: Option<String>,
    pub ukuran: Option<String>,
    pub prod_div: Option<String>,
    pub prod_grp: Option<String>,
    pub prod_cat: Option<String>,
    pub retail_price_per_unit: Option<f32>,
    pub goods_received_quantity: Option<f32>,
    pub goods_received_cost: Option<f32>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataStok {
    pub loc_code: Option<String>,
    pub brand_dim: Option<String>,
    pub oricode: Option<String>,
    pub deskripsi_produk: Option<String>,
    pub warna: Option<String>,
    pub ukuran: Option<String>,
    pub season: Option<String>,
    pub period: Option<String>,
    pub prod_div: Option<String>,
    pub prod_grp: Option<String>,
    pub prod_cat: Option<String>,
    pub retail_price_per_unit: Option<f32>,
    pub stock_quantity: Option<f32>,
    pub stock_cost: Option<f32>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataKetersediaanStok {
    pub loc_code: Option<String>,
    pub brand_dim: Option<String>,
    pub oricode: Option<String>,
    pub ukuran: Option<String>,
    pub season: Option<String>,
    pub period: Option<String>,
    pub deskripsi_produk: Option<String>,
    pub warna: Option<String>,
    pub prod_div: Option<String>,
    pub prod_grp: Option<String>,
    pub prod_cat: Option<String>,
    pub item_disc_group: Option<String>,
    pub retail_price_per_unit: Option<f32>,
    pub stock_on_hand: Option<f32>,
    pub total_cost: Option<f32>,
    pub po_outstanding_qty: Option<f32>,
    pub so_outstanding_qty: Option<f32>,
    pub proj_stock_intake: Option<f32>,
    pub proj_stock_aft_so: Option<f32>,
}

#[derive(Clone, Debug, FieldNamesAsArray)]
#[field_names_as_array(visibility = "pub")]
pub struct DataLabaRugiToko {
    pub coa: Option<String>,
    pub acc_name: Option<String>,
    pub store_code: Option<String>,
    pub store_desc: Option<String>,
    pub amount: Option<f32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProposalTokoBaru {
    proposal_id: String,
    versi: i32,
    data: DataInputOutputProposalTokoBaru,
}

#[derive(Debug, Serialize, Deserialize)]
struct DataInputOutputProposalTokoBaru {
    input: InputProposalTokoBaru,
    output: UserModelOutputProposalTokoBaru,
    log_output: Vec<String>,
    remark: RemarkProposal,
    dibuat: DateTime,
    diedit: DateTime,
    pengguna: String,
    status: i32,
}

#[derive(Debug, Serialize, Deserialize)]
struct InputProposalTokoBaru {
    nama_model: String,
    versi_model: String,
    sbu: String,
    kota_kabupaten: String,
    rentang_populasi: String,
    kelas_mall: String,
    luas_toko: f64,
    prediksi_model: f64,
    prediksi_user: i64,
    margin_penjualan: f64,
    ppn: f64,
    tahun_umr: i64,
    provinsi_umr: String,
    jumlah_staff: i64,
    biaya_atk_utilitas: f64,
    biaya_sewa: i64,
    lama_sewa: i64,
    biaya_fitout: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct UserModelOutputProposalTokoBaru {
    user_generated: OutputProposalTokoBaru,
    model_generated: OutputProposalTokoBaru,
}

#[derive(Debug, Serialize, Deserialize)]
struct OutputProposalTokoBaru {
    vat: f64,
    net_sales: f64,
    cogs: f64,
    gross_profit: f64,
    staff_expense: i64,
    oau_expense: f64,
    rental_expense: f64,
    fitout_expense: f64,
    store_income: f64,
}

#[derive(Debug, Serialize, Deserialize)]
struct RemarkProposal {
    konten: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LabelNilaiInputItem {
    label: String,
    nilai: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Model {
    pub sbu: Vec<String>,
    pub rentang_populasi_er: Vec<LabelNilaiInputItem>,
    pub kelas_mall_er: Vec<LabelNilaiInputItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InputItemUMRKelayakanTokoBaru {
    pub tahun_data: i32,
    pub data: Vec<LabelNilaiInputItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InputItemKelayakanTokoBaru {
    pub sbu_item: Vec<String>,
    pub rentang_populasi_item: Vec<LabelNilaiInputItem>,
    pub kelas_mall_item: Vec<LabelNilaiInputItem>,
    pub umr_item: Vec<InputItemUMRKelayakanTokoBaru>,
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

        vektor_series
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

        vektor_series
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

        vektor_series
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

        vektor_series
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

        vektor_series
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

        vektor_series
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

        vektor_series
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

        vektor_series
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

        vektor_series
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

        vektor_series
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

        vektor_series
    }
}

impl DataFrameSerial for Vec<DataKlasifikasiByILE> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_classification = Vec::new();

        for baris in self {
            for kolom in 0..DataKlasifikasiByILE::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_classification.push(baris.classification.clone()),
                    _ => println!("Nothing!"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataKlasifikasiByILE::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataKlasifikasiByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataKlasifikasiByILE::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_classification.clone(),
                )),
                _ => println!("Nothing"),
            }
        }

        vektor_series
    }
}

impl DataFrameSerial for Vec<DataPenerimaanBarang> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_no_entry = Vec::new();
        let mut vektor_post_date = Vec::new();
        let mut vektor_no_dokumen_pr = Vec::new();
        let mut vektor_no_dokumen_wr = Vec::new();
        let mut vektor_no_dokumen_po = Vec::new();
        let mut vektor_loc_code = Vec::new();
        let mut vektor_brand_dim = Vec::new();
        let mut vektor_oricode = Vec::new();
        let mut vektor_deskripsi_produk = Vec::new();
        let mut vektor_warna = Vec::new();
        let mut vektor_ukuran = Vec::new();
        let mut vektor_prod_div = Vec::new();
        let mut vektor_prod_grp = Vec::new();
        let mut vektor_prod_cat = Vec::new();
        let mut vektor_retail_price_per_unit = Vec::new();
        let mut vektor_goods_received_quantity = Vec::new();
        let mut vektor_goods_received_cost = Vec::new();

        for baris in self {
            for kolom in 0..DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_no_entry.push(baris.no_entry),
                    1 => vektor_post_date.push(baris.post_date),
                    2 => vektor_no_dokumen_pr.push(baris.no_dokumen_pr.clone()),
                    3 => vektor_no_dokumen_wr.push(baris.no_dokumen_wr.clone()),
                    4 => vektor_no_dokumen_po.push(baris.no_dokumen_po.clone()),
                    5 => vektor_loc_code.push(baris.loc_code.clone()),
                    6 => vektor_brand_dim.push(baris.brand_dim.clone()),
                    7 => vektor_oricode.push(baris.oricode.clone()),
                    8 => vektor_deskripsi_produk.push(baris.deskripsi_produk.clone()),
                    9 => vektor_warna.push(baris.warna.clone()),
                    10 => vektor_ukuran.push(baris.ukuran.clone()),
                    11 => vektor_prod_div.push(baris.prod_div.clone()),
                    12 => vektor_prod_grp.push(baris.prod_grp.clone()),
                    13 => vektor_prod_cat.push(baris.prod_cat.clone()),
                    14 => vektor_retail_price_per_unit.push(baris.retail_price_per_unit),
                    15 => vektor_goods_received_quantity.push(baris.goods_received_quantity),
                    16 => vektor_goods_received_cost.push(baris.goods_received_cost),
                    _ => println!("Nothing"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_entry.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_post_date.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_dokumen_pr.clone(),
                )),
                3 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_dokumen_wr.clone(),
                )),
                4 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_no_dokumen_po.clone(),
                )),
                5 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_loc_code.clone(),
                )),
                6 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_brand_dim.clone(),
                )),
                7 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_oricode.clone(),
                )),
                8 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_deskripsi_produk.clone(),
                )),
                9 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_warna.clone(),
                )),
                10 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_ukuran.clone(),
                )),
                11 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_div.clone(),
                )),
                12 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_grp.clone(),
                )),
                13 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_cat.clone(),
                )),
                14 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_retail_price_per_unit.clone(),
                )),
                15 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_goods_received_quantity.clone(),
                )),
                16 => vektor_series.push(Series::new(
                    DataPenerimaanBarang::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_goods_received_cost.clone(),
                )),
                _ => println!("Nothing"),
            }
        }
        vektor_series
    }
}

impl DataFrameSerial for Vec<DataStok> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_loc_code = Vec::new();
        let mut vektor_brand_dim = Vec::new();
        let mut vektor_oricode = Vec::new();
        let mut vektor_deskripsi_produk = Vec::new();
        let mut vektor_warna = Vec::new();
        let mut vektor_ukuran = Vec::new();
        let mut vektor_season = Vec::new();
        let mut vektor_period = Vec::new();
        let mut vektor_prod_div = Vec::new();
        let mut vektor_prod_grp = Vec::new();
        let mut vektor_prod_cat = Vec::new();
        let mut vektor_retail_price_per_unit = Vec::new();
        let mut vektor_stock_quantity = Vec::new();
        let mut vektor_stock_cost = Vec::new();

        for baris in self {
            for kolom in 0..DataStok::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_loc_code.push(baris.loc_code.clone()),
                    1 => vektor_brand_dim.push(baris.brand_dim.clone()),
                    2 => vektor_oricode.push(baris.oricode.clone()),
                    3 => vektor_deskripsi_produk.push(baris.deskripsi_produk.clone()),
                    4 => vektor_warna.push(baris.warna.clone()),
                    5 => vektor_ukuran.push(baris.ukuran.clone()),
                    6 => vektor_season.push(baris.season.clone()),
                    7 => vektor_period.push(baris.period.clone()),
                    8 => vektor_prod_div.push(baris.prod_div.clone()),
                    9 => vektor_prod_grp.push(baris.prod_grp.clone()),
                    10 => vektor_prod_cat.push(baris.prod_cat.clone()),
                    11 => vektor_retail_price_per_unit.push(baris.retail_price_per_unit),
                    12 => vektor_stock_quantity.push(baris.stock_quantity),
                    13 => vektor_stock_cost.push(baris.stock_cost),
                    _ => println!("Nothing"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataStok::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_loc_code.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_brand_dim.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_oricode.clone(),
                )),
                3 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_deskripsi_produk.clone(),
                )),
                4 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_warna.clone(),
                )),
                5 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_ukuran.clone(),
                )),
                6 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_season.clone(),
                )),
                7 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_period.clone(),
                )),
                8 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_div.clone(),
                )),
                9 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_grp.clone(),
                )),
                10 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_cat.clone(),
                )),
                11 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_retail_price_per_unit.clone(),
                )),
                12 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_stock_quantity.clone(),
                )),
                13 => vektor_series.push(Series::new(
                    DataStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_stock_cost.clone(),
                )),
                _ => println!("Nothing"),
            }
        }
        vektor_series
    }
}

impl DataFrameSerial for Vec<DataKetersediaanStok> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_loc_code = Vec::new();
        let mut vektor_brand_dim = Vec::new();
        let mut vektor_oricode = Vec::new();
        let mut vektor_ukuran = Vec::new();
        let mut vektor_season = Vec::new();
        let mut vektor_period = Vec::new();
        let mut vektor_deskripsi_produk = Vec::new();
        let mut vektor_warna = Vec::new();
        let mut vektor_prod_div = Vec::new();
        let mut vektor_prod_grp = Vec::new();
        let mut vektor_prod_cat = Vec::new();
        let mut vektor_item_disc_group = Vec::new();
        let mut vektor_retail_price_per_unit = Vec::new();
        let mut vektor_stock_on_hand = Vec::new();
        let mut vektor_total_cost = Vec::new();
        let mut vektor_po_outstanding_qty = Vec::new();
        let mut vektor_so_outstanding_qty = Vec::new();
        let mut vektor_proj_stock_intake = Vec::new();
        let mut vektor_proj_stock_aft_so = Vec::new();

        for baris in self {
            for kolom in 0..DataKetersediaanStok::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_loc_code.push(baris.loc_code.clone()),
                    1 => vektor_brand_dim.push(baris.brand_dim.clone()),
                    2 => vektor_oricode.push(baris.oricode.clone()),
                    3 => vektor_ukuran.push(baris.ukuran.clone()),
                    4 => vektor_season.push(baris.season.clone()),
                    5 => vektor_period.push(baris.period.clone()),
                    6 => vektor_deskripsi_produk.push(baris.deskripsi_produk.clone()),
                    7 => vektor_warna.push(baris.warna.clone()),
                    8 => vektor_prod_div.push(baris.prod_div.clone()),
                    9 => vektor_prod_grp.push(baris.prod_grp.clone()),
                    10 => vektor_prod_cat.push(baris.prod_cat.clone()),
                    11 => vektor_item_disc_group.push(baris.item_disc_group.clone()),
                    12 => vektor_retail_price_per_unit.push(baris.retail_price_per_unit),
                    13 => vektor_stock_on_hand.push(baris.stock_on_hand),
                    14 => vektor_total_cost.push(baris.total_cost),
                    15 => vektor_po_outstanding_qty.push(baris.po_outstanding_qty),
                    16 => vektor_so_outstanding_qty.push(baris.so_outstanding_qty),
                    17 => vektor_proj_stock_intake.push(baris.proj_stock_intake),
                    18 => vektor_proj_stock_aft_so.push(baris.proj_stock_aft_so),
                    _ => println!("Nothing"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataKetersediaanStok::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_loc_code.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_brand_dim.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_oricode.clone(),
                )),
                3 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_ukuran.clone(),
                )),
                4 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_season.clone(),
                )),
                5 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_period.clone(),
                )),
                6 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_deskripsi_produk.clone(),
                )),
                7 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_warna.clone(),
                )),
                8 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_div.clone(),
                )),
                9 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_grp.clone(),
                )),
                10 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_prod_cat.clone(),
                )),
                11 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_item_disc_group.clone(),
                )),
                12 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_retail_price_per_unit.clone(),
                )),
                13 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_stock_on_hand.clone(),
                )),
                14 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_total_cost.clone(),
                )),
                15 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_po_outstanding_qty.clone(),
                )),
                16 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_so_outstanding_qty.clone(),
                )),
                17 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_proj_stock_intake.clone(),
                )),
                18 => vektor_series.push(Series::new(
                    DataKetersediaanStok::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_proj_stock_aft_so.clone(),
                )),
                _ => println!("Nothing"),
            }
        }
        vektor_series
    }
}

impl DataFrameSerial for Vec<DataLabaRugiToko> {
    fn ke_series(&self) -> Vec<Series> {
        let mut vektor_coa = Vec::new();
        let mut vektor_acc_name = Vec::new();
        let mut vektor_store_code = Vec::new();
        let mut vektor_store_desc = Vec::new();
        let mut vektor_amount = Vec::new();

        for baris in self {
            for kolom in 0..DataLabaRugiToko::FIELD_NAMES_AS_ARRAY.len() {
                match kolom {
                    0 => vektor_coa.push(baris.coa.clone()),
                    1 => vektor_acc_name.push(baris.acc_name.clone()),
                    2 => vektor_store_code.push(baris.store_code.clone()),
                    3 => vektor_store_desc.push(baris.store_desc.clone()),
                    4 => vektor_amount.push(baris.amount),
                    _ => println!("Nothing"),
                }
            }
        }

        let mut vektor_series = Vec::new();
        for hitung in 0..DataLabaRugiToko::FIELD_NAMES_AS_ARRAY.len() {
            match hitung {
                0 => vektor_series.push(Series::new(
                    DataLabaRugiToko::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_coa.clone(),
                )),
                1 => vektor_series.push(Series::new(
                    DataLabaRugiToko::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_acc_name.clone(),
                )),
                2 => vektor_series.push(Series::new(
                    DataLabaRugiToko::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_store_code.clone(),
                )),
                3 => vektor_series.push(Series::new(
                    DataLabaRugiToko::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_store_desc.clone(),
                )),
                4 => vektor_series.push(Series::new(
                    DataLabaRugiToko::FIELD_NAMES_AS_ARRAY[hitung],
                    vektor_amount.clone(),
                )),
                _ => println!("Nothing"),
            }
        }
        vektor_series
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Kueri<'a> {
    pub judul: &'a str,
    pub kueri: &'a str,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Dimensi<'a> {
    pub sbu: &'a str,
    #[serde(deserialize_with = "deserialize_vektor")]
    pub dimensi: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Filter {
    #[serde(deserialize_with = "deserialize_vektor")]
    pub brand: Vec<String>,
    pub prod_div: Vec<String>,
    pub prod_grp: Vec<String>,
    pub prod_cat: Vec<String>,
    pub sbu: Option<Vec<String>>,
    pub lokasi: Option<Vec<String>>,
    pub klasifikasi: Option<Vec<String>>,
    pub region: Option<Vec<String>>,
}

fn deserialize_vektor<'de, D>(deserializer: D) -> Result<Vec<String>, D::Error>
where
    D: Deserializer<'de>,
{
    let vec: Vec<String> = Deserialize::deserialize(deserializer)?;
    Ok(vec)
}

pub enum HasilKueriPenjualan {
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
    DataKlasifikasiILEEnum(Vec<DataKlasifikasiByILE>),
}

pub enum HasilKueriPenerimaanBarang {
    DataPenerimaanBarangEnum(Vec<DataPenerimaanBarang>),
}

pub enum HasilKueriStok {
    DataStokEnum(Vec<DataStok>),
}

pub enum HasilKueriKetersediaanStok {
    DataKetersediaanStokEnum(Vec<DataKetersediaanStok>),
}

pub enum HasilKueriLabaRugiToko {
    DataLabaRugiTokoEnum(Vec<DataLabaRugiToko>),
}
