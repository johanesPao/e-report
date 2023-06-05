use tiberius::{AuthMethod, Client, Config, Row};
use tokio::net::TcpStream;
use tokio_util::compat::{Compat, TokioAsyncWriteCompatExt};

use crate::fungsi::rahasia;

async fn buka_koneksi_bc(
    ip: &str,
    port: u16,
    user: &str,
    pwd: &str,
    database: &str,
) -> Result<Client<Compat<TcpStream>>, Box<dyn std::error::Error>> {
    let mut konfigurasi = Config::new();
    konfigurasi.host(ip);
    konfigurasi.port(port);
    konfigurasi.database(database);
    konfigurasi.trust_cert();
    konfigurasi.authentication(AuthMethod::sql_server(user, pwd));

    let tcp = TcpStream::connect(konfigurasi.get_addr()).await?;
    tcp.set_nodelay(true)?;

    let klien = Client::connect(konfigurasi, tcp.compat_write()).await?;
    Ok(klien)
}

pub async fn cek_koneksi_bc(
    ip: &str,
    port: u16,
    user: &str,
    pwd: &str,
    database: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    buka_koneksi_bc(ip, port, user, pwd, database).await?;
    Ok(())
}

pub async fn eksekusi_kueri(kueri: String) -> Result<Vec<Vec<Row>>, Box<dyn std::error::Error>> {
    let mut klien = buka_koneksi_bc(
        rahasia::BC_IP,
        rahasia::BC_PORT,
        rahasia::BC_USER,
        rahasia::BC_PWD,
        rahasia::BC_DB,
    )
    .await?;

    let kueri = klien.query(kueri, &[]).await?;
    let set_hasil_kueri = kueri.into_results().await?;

    Ok(set_hasil_kueri)
}
