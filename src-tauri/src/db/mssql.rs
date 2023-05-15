use tiberius::{Config, Client, AuthMethod};
use tokio_util::compat::TokioAsyncWriteCompatExt;
use tokio::net::TcpStream;

// use crate::fungsi::rahasia;

async fn buka_koneksi_bc(ip: &str, port: u16, user: &str, pwd: &str) -> Result<Client<tokio_util::compat::Compat<tokio::net::TcpStream>>, Box<dyn std::error::Error>> {
    let mut konfigurasi = Config::new();
    konfigurasi.host(ip);
    konfigurasi.port(port);
    konfigurasi.trust_cert();
    konfigurasi.authentication(AuthMethod::sql_server(user, pwd));

    let tcp = TcpStream::connect(konfigurasi.get_addr()).await?;
    tcp.set_nodelay(true)?;

    let klien = Client::connect(konfigurasi, tcp.compat_write()).await?;
    Ok(klien)
}

pub async fn cek_koneksi_bc(ip: &str, port: u16, user: &str, pwd: &str) -> Result<(), Box<dyn std::error::Error>> {
    buka_koneksi_bc(ip, port, user, pwd).await?;
    Ok(())
}