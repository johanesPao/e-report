use tiberius::numeric::Numeric;

use crate::db::mssql;
use crate::struktur::*;

pub async fn kueri_umum(kueri: String) -> Result<Vec<Vec<String>>, Box<dyn std::error::Error>> {
    let mut data = Vec::new();
    let hasil_kueri = mssql::eksekusi_kueri(kueri).await?;
    if hasil_kueri[0].len() > 0 {
        let jumlah_baris = hasil_kueri[0].len();
        let jumlah_kolom = hasil_kueri[0][0].columns().len();

        for baris in 0..jumlah_baris {
            let mut vektor_baris = Vec::new();
            for kolom in 0..jumlah_kolom {
                let nilai_kolom = hasil_kueri[0][baris]
                    .get(kolom)
                    .map(|nilai: &str| nilai.to_string());
                match nilai_kolom {
                    Some(nilai) => vektor_baris.push(nilai),
                    None => vektor_baris.push(String::from("")),
                }
            }
            data.push(vektor_baris);
        }
    }
    Ok(data)
}

pub async fn kueri_penjualan(
    kueri: Kueri<'_>,
) -> Result<HasilKueriPenjualan, Box<dyn std::error::Error>> {
    match kueri.judul {
        "ILEByPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let post_date = hasil_kueri[baris].get(1);
                    let system_created_at = hasil_kueri[baris].get(2);
                    let store_dim = hasil_kueri[baris].get(3).map(|teks: &str| teks.to_string());
                    let loc_code = hasil_kueri[baris].get(4).map(|teks: &str| teks.to_string());
                    let no_dokumen = hasil_kueri[baris].get(5).map(|teks: &str| teks.to_string());
                    let source_no = hasil_kueri[baris].get(6).map(|teks: &str| teks.to_string());
                    let brand_dim = hasil_kueri[baris].get(7).map(|teks: &str| teks.to_string());
                    let oricode = hasil_kueri[baris].get(8).map(|teks: &str| teks.to_string());
                    let ukuran = hasil_kueri[baris].get(9).map(|teks: &str| teks.to_string());
                    let data_penjualan = DataILE {
                        no_entry,
                        post_date,
                        system_created_at,
                        store_dim,
                        loc_code,
                        no_dokumen,
                        source_no,
                        brand_dim,
                        oricode,
                        ukuran,
                    };
                    vektor_data.push(data_penjualan);
                }
            }
            Ok(HasilKueriPenjualan::DataILEEnum(vektor_data))
        }
        "salespersonAndRegionByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let salesperson = hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let region = hasil_kueri[baris].get(2).map(|teks: &str| teks.to_string());
                    let data_salesperson_region = DataSalespersonRegionByILE {
                        no_entry,
                        salesperson,
                        region,
                    };
                    vektor_data.push(data_salesperson_region);
                }
            }
            Ok(HasilKueriPenjualan::DataSalespersonRegionILEEnum(
                vektor_data,
            ))
        }
        "tokoByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let kode_toko = hasil_kueri[baris].get(0).map(|teks: &str| teks.to_string());
                    let toko = hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let data_toko = DataTokoByILE { kode_toko, toko };
                    vektor_data.push(data_toko);
                }
            }
            Ok(HasilKueriPenjualan::DataTokoILEEnum(vektor_data))
        }
        "produkByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let oricode = hasil_kueri[baris].get(0).map(|teks: &str| teks.to_string());
                    let deskripsi_produk =
                        hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let warna = hasil_kueri[baris].get(2).map(|teks: &str| teks.to_string());
                    let prod_div = hasil_kueri[baris].get(3).map(|teks: &str| teks.to_string());
                    let prod_grp = hasil_kueri[baris].get(4).map(|teks: &str| teks.to_string());
                    let prod_cat = hasil_kueri[baris].get(5).map(|teks: &str| teks.to_string());
                    let period = hasil_kueri[baris].get(6).map(|teks: &str| teks.to_string());
                    let season = hasil_kueri[baris].get(7).map(|teks: &str| teks.to_string());
                    let data_produk = DataProdukByILE {
                        oricode,
                        deskripsi_produk,
                        warna,
                        prod_div,
                        prod_grp,
                        prod_cat,
                        period,
                        season,
                    };
                    vektor_data.push(data_produk);
                }
            }
            Ok(HasilKueriPenjualan::DataProdukILEEnum(vektor_data))
        }
        "vatByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_dokumen = hasil_kueri[baris].get(0).map(|teks: &str| teks.to_string());
                    let ppn = hasil_kueri[baris]
                        .get(1)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_vat = DataVatByILE { no_dokumen, ppn };
                    vektor_data.push(data_vat);
                }
            }
            Ok(HasilKueriPenjualan::DataVatILEEnum(vektor_data))
        }
        "promoByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let promo = hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let data_promo = DataPromoByILE { no_entry, promo };
                    vektor_data.push(data_promo);
                }
            }
            Ok(HasilKueriPenjualan::DataPromoILEEnum(vektor_data))
        }
        "diskonByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let diskon = hasil_kueri[baris]
                        .get(1)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_diskon = DataDiskonByILE { no_entry, diskon };
                    vektor_data.push(data_diskon);
                }
            }
            Ok(HasilKueriPenjualan::DataDiskonILEEnum(vektor_data))
        }
        "dokumenLainnyaByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let no_dokumen_oth =
                        hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let data_dokumen_lainnya = DataDokumenLainnyaByILE {
                        no_entry,
                        no_dokumen_oth,
                    };
                    vektor_data.push(data_dokumen_lainnya);
                }
            }
            Ok(HasilKueriPenjualan::DataDokumenLainnyaILEEnum(vektor_data))
        }
        "quantityByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let kuantitas = hasil_kueri[baris]
                        .get(1)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_kuantitas = DataKuantitasByILE {
                        no_entry,
                        kuantitas,
                    };
                    vektor_data.push(data_kuantitas);
                }
            }
            Ok(HasilKueriPenjualan::DataKuantitasILEEnum(vektor_data))
        }
        "cppuByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let cost_price_per_unit = hasil_kueri[baris]
                        .get(1)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let total_sales_at_retail_aft_vat = hasil_kueri[baris]
                        .get(2)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_cppu = DataCPPUByILE {
                        no_entry,
                        cost_price_per_unit,
                        total_sales_at_retail_aft_vat,
                    };
                    vektor_data.push(data_cppu);
                }
            }
            Ok(HasilKueriPenjualan::DataCPPUILEEnum(vektor_data))
        }
        "klasifikasiByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let classification =
                        hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let data_klasifikasi = DataKlasifikasiByILE {
                        no_entry,
                        classification,
                    };
                    vektor_data.push(data_klasifikasi);
                }
            }
            Ok(HasilKueriPenjualan::DataKlasifikasiILEEnum(vektor_data))
        }
        "rppuByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let retail_price_per_unit = hasil_kueri[baris]
                        .get(1)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_rppu = DataRPPUByILE {
                        no_entry,
                        retail_price_per_unit,
                    };
                    vektor_data.push(data_rppu);
                }
            }
            Ok(HasilKueriPenjualan::DataRPPUILEEnum(vektor_data))
        }
        _ => Err("Shouldn't happened".into()),
    }
}

pub async fn kueri_penerimaan_barang(
    kueri: Kueri<'_>,
) -> Result<HasilKueriPenerimaanBarang, Box<dyn std::error::Error>> {
    match kueri.judul {
        "penerimaanBarangByILEPostDate" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let no_entry = hasil_kueri[baris].get(0);
                    let post_date = hasil_kueri[baris].get(1);
                    let no_dokumen_pr =
                        hasil_kueri[baris].get(2).map(|teks: &str| teks.to_string());
                    let no_dokumen_wr =
                        hasil_kueri[baris].get(3).map(|teks: &str| teks.to_string());
                    let no_dokumen_po =
                        hasil_kueri[baris].get(4).map(|teks: &str| teks.to_string());
                    let loc_code = hasil_kueri[baris].get(5).map(|teks: &str| teks.to_string());
                    let brand_dim = hasil_kueri[baris].get(6).map(|teks: &str| teks.to_string());
                    let oricode = hasil_kueri[baris].get(7).map(|teks: &str| teks.to_string());
                    let deskripsi_produk =
                        hasil_kueri[baris].get(8).map(|teks: &str| teks.to_string());
                    let warna = hasil_kueri[baris].get(9).map(|teks: &str| teks.to_string());
                    let ukuran = hasil_kueri[baris]
                        .get(10)
                        .map(|teks: &str| teks.to_string());
                    let prod_div = hasil_kueri[baris]
                        .get(11)
                        .map(|teks: &str| teks.to_string());
                    let prod_grp = hasil_kueri[baris]
                        .get(12)
                        .map(|teks: &str| teks.to_string());
                    let prod_cat = hasil_kueri[baris]
                        .get(13)
                        .map(|teks: &str| teks.to_string());
                    let retail_price_per_unit = hasil_kueri[baris]
                        .get(14)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let goods_received_quantity = hasil_kueri[baris]
                        .get(15)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let goods_received_cost = hasil_kueri[baris]
                        .get(16)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_peneriman_barang = DataPenerimaanBarang {
                        no_entry,
                        post_date,
                        no_dokumen_pr,
                        no_dokumen_wr,
                        no_dokumen_po,
                        loc_code,
                        brand_dim,
                        oricode,
                        deskripsi_produk,
                        warna,
                        ukuran,
                        prod_div,
                        prod_grp,
                        prod_cat,
                        retail_price_per_unit,
                        goods_received_quantity,
                        goods_received_cost,
                    };
                    vektor_data.push(data_peneriman_barang);
                }
            }
            Ok(HasilKueriPenerimaanBarang::DataPenerimaanBarangEnum(
                vektor_data,
            ))
        }
        _ => Err("Shouldn't happened".into()),
    }
}

pub async fn kueri_stok(kueri: Kueri<'_>) -> Result<HasilKueriStok, Box<dyn std::error::Error>> {
    match kueri.judul {
        "endingStokByILE" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let loc_code = hasil_kueri[baris].get(0).map(|teks: &str| teks.to_string());
                    let brand_dim = hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let oricode = hasil_kueri[baris].get(2).map(|teks: &str| teks.to_string());
                    let deskripsi_produk =
                        hasil_kueri[baris].get(3).map(|teks: &str| teks.to_string());
                    let warna = hasil_kueri[baris].get(4).map(|teks: &str| teks.to_string());
                    let ukuran = hasil_kueri[baris].get(5).map(|teks: &str| teks.to_string());
                    let season = hasil_kueri[baris].get(6).map(|teks: &str| teks.to_string());
                    let period = hasil_kueri[baris].get(7).map(|teks: &str| teks.to_string());
                    let prod_div = hasil_kueri[baris].get(8).map(|teks: &str| teks.to_string());
                    let prod_grp = hasil_kueri[baris].get(9).map(|teks: &str| teks.to_string());
                    let prod_cat = hasil_kueri[baris]
                        .get(10)
                        .map(|teks: &str| teks.to_string());
                    let retail_price_per_unit = hasil_kueri[baris]
                        .get(11)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let stock_quantity = hasil_kueri[baris]
                        .get(12)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let stock_cost = hasil_kueri[baris]
                        .get(13)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_stok = DataStok {
                        loc_code,
                        brand_dim,
                        oricode,
                        deskripsi_produk,
                        warna,
                        ukuran,
                        season,
                        period,
                        prod_div,
                        prod_grp,
                        prod_cat,
                        retail_price_per_unit,
                        stock_quantity,
                        stock_cost,
                    };
                    vektor_data.push(data_stok);
                }
            }
            Ok(HasilKueriStok::DataStokEnum(vektor_data))
        }
        _ => Err("Shouldn't happened".into()),
    }
}

pub async fn kueri_ketersediaan_stok(
    kueri: Kueri<'_>,
) -> Result<HasilKueriKetersediaanStok, Box<dyn std::error::Error>> {
    match kueri.judul {
        "ketersediaanStokByILE" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let loc_code = hasil_kueri[baris].get(0).map(|teks: &str| teks.to_string());
                    let brand_dim = hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let oricode = hasil_kueri[baris].get(2).map(|teks: &str| teks.to_string());
                    let ukuran = hasil_kueri[baris].get(3).map(|teks: &str| teks.to_string());
                    let season = hasil_kueri[baris].get(4).map(|teks: &str| teks.to_string());
                    let period = hasil_kueri[baris].get(5).map(|teks: &str| teks.to_string());
                    let deskripsi_produk =
                        hasil_kueri[baris].get(6).map(|teks: &str| teks.to_string());
                    let warna = hasil_kueri[baris].get(7).map(|teks: &str| teks.to_string());
                    let prod_div = hasil_kueri[baris].get(8).map(|teks: &str| teks.to_string());
                    let prod_grp = hasil_kueri[baris].get(9).map(|teks: &str| teks.to_string());
                    let prod_cat = hasil_kueri[baris]
                        .get(10)
                        .map(|teks: &str| teks.to_string());
                    let item_disc_group = hasil_kueri[baris]
                        .get(11)
                        .map(|teks: &str| teks.to_string());
                    let retail_price_per_unit = hasil_kueri[baris]
                        .get(12)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let stock_on_hand = hasil_kueri[baris]
                        .get(13)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let total_cost = hasil_kueri[baris]
                        .get(14)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let po_outstanding_qty = hasil_kueri[baris]
                        .get(15)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let so_outstanding_qty = hasil_kueri[baris]
                        .get(16)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let proj_stock_intake = hasil_kueri[baris]
                        .get(17)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let proj_stock_aft_so = hasil_kueri[baris]
                        .get(18)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_ketersediaan_stok = DataKetersediaanStok {
                        loc_code,
                        brand_dim,
                        oricode,
                        ukuran,
                        season,
                        period,
                        deskripsi_produk,
                        warna,
                        prod_div,
                        prod_grp,
                        prod_cat,
                        item_disc_group,
                        retail_price_per_unit,
                        stock_on_hand,
                        total_cost,
                        po_outstanding_qty,
                        so_outstanding_qty,
                        proj_stock_intake,
                        proj_stock_aft_so,
                    };
                    vektor_data.push(data_ketersediaan_stok);
                }
            }
            Ok(HasilKueriKetersediaanStok::DataKetersediaanStokEnum(
                vektor_data,
            ))
        }
        _ => Err("Shouldn't happened".into()),
    }
}

pub async fn kueri_laba_rugi_toko(
    kueri: Kueri<'_>,
) -> Result<HasilKueriLabaRugiToko, Box<dyn std::error::Error>> {
    match kueri.judul {
        "storePNL" => {
            let mut vektor_data = Vec::new();
            let hasil_kueri = &mssql::eksekusi_kueri(kueri.kueri.to_string()).await?[0];
            if hasil_kueri.len() > 0 {
                for baris in 0..hasil_kueri.len() {
                    let coa = hasil_kueri[baris].get(0).map(|teks: &str| teks.to_string());
                    let acc_name = hasil_kueri[baris].get(1).map(|teks: &str| teks.to_string());
                    let store_code = hasil_kueri[baris].get(2).map(|teks: &str| teks.to_string());
                    let store_desc = hasil_kueri[baris].get(3).map(|teks: &str| teks.to_string());
                    let amount = hasil_kueri[baris]
                        .get(4)
                        .map(|n: Numeric| n.to_string().parse().unwrap());
                    let data_laba_rugi_toko = DataLabaRugiToko {
                        coa,
                        acc_name,
                        store_code,
                        store_desc,
                        amount,
                    };
                    vektor_data.push(data_laba_rugi_toko);
                }
            }
            Ok(HasilKueriLabaRugiToko::DataLabaRugiTokoEnum(vektor_data))
        }
        _ => Err("Shouldn't happened".into()),
    }
}
