import { useAppDispatch, useAppSelector } from "../state/hook";
import { getKonekKeBC } from "../fitur_state/event";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { PropsPenjualan } from "../komponen/Konten";

const Penjualan = ({ propsPenjualan }: { propsPenjualan: PropsPenjualan }) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);

  return (
    <>
      <TombolDrawer
        label="Input Parameter Penjualan"
        nonAktif={konekKeBc}
        aksiRedux={dispatch}
        warna="teal"
      />
      <div>Nilai Tgl Awal: {`${propsPenjualan.tglAwal}`}</div>
      <div>Nilai Tgl Akhir: {`${propsPenjualan.tglAkhir}`}</div>
      <div>Nilai Brand: {`${propsPenjualan.brand}`}</div>
      <div>Nilai Produk Divisi: {`${propsPenjualan.prodDiv}`}</div>
      <div>Nilai Produk Group: {`${propsPenjualan.prodGrp}`}</div>
      <div>Nilai Produk Category: {`${propsPenjualan.prodCat}`}</div>
      <div>Nilai SBU: {`${propsPenjualan.SBU}`}</div>
      <div>Nilai Lokasi: {`${propsPenjualan.lokasi}`}</div>
      <div>Nilai Klasifikasi: {`${propsPenjualan.klasifikasi}`}</div>
      <div>Nilai Region: {`${propsPenjualan.region}`}</div>
    </>
  );
};

export default Penjualan;
