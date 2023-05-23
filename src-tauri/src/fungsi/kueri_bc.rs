use crate::db::mssql;

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
