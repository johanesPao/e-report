use crate::db::mssql;
use crate::struktur::*;

pub async fn kueri_umum(kueri: String) -> Result<Vec<Vec<String>>, Box<dyn std::error::Error>> {
    let mut data = Vec::new();
    let hasil_kueri = mssql::kueri(kueri).await?;
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
    kueri: String,
) -> Result<Vec<DataPenjualan>, Box<dyn std::error::Error>> {
    let mut data = Vec::new();
    let hasil_kueri = &mssql::kueri(kueri).await?[0];
    if hasil_kueri.len() > 0 {
        let jumlah_baris_data = hasil_kueri.len();
        for baris in 0..jumlah_baris_data {
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
            let data_penjualan = DataPenjualan {
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
            data.push(data_penjualan);
        }
    }
    Ok(data)
}
