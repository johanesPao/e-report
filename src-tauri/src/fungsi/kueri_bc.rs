use crate::db::mssql;

pub async fn parameter_brand(kueri: String) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut data = Vec::new();
    let hasil_kueri = mssql::kueri(kueri).await?;
    if hasil_kueri[0].len() > 0 {
        let jumlah_baris = hasil_kueri[0].len();

        for baris in 0..jumlah_baris {
            let opsi_nilai = hasil_kueri[0][baris]
                .get(0)
                .map(|brand: &str| brand.to_string());
            match opsi_nilai {
                Some(nilai) => data.push(nilai),
                None => data.push(String::from("")),
            }
        }
    };
    Ok(data)
}
