import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DrawerInput from "./Drawer";

import Dashboard from "../halaman/Dashboard";
import Layout from "../komponen/Layout";
import Penjualan from "../halaman/Penjualan";
import PenerimaanBarang from "../halaman/PenerimaanBarang";
import Stok from "../halaman/Stok";
import KetersediaanStok from "../halaman/KetersediaanStok";
import BuyingProposal from "../halaman/BuyingProposal";
import LabaRugiToko from "../halaman/LabaRugiToko";
import KelayakanTokoBaru from "../halaman/KelayakanTokoBaru";

import { getSesiAktif, getHalaman, setHalaman } from "../fitur_state/event";
import { useAppSelector, useAppDispatch } from "../state/hook";
import { Container } from "@mantine/core";

export interface PropsPenjualan {
  tglAwal: Date | null;
  tglAkhir: Date | null;
  brand: string[];
  prodDiv: string[];
  prodGrp: string[];
  prodCat: string[];
  SBU?: string[];
  lokasi?: string[];
  klasifikasi?: string[];
  region?: string[];
}

const Konten = () => {
  const navigasi = useNavigate();
  const dispatch = useAppDispatch();
  const sesiAktif = useAppSelector(getSesiAktif);
  const halaman = useAppSelector(getHalaman);
  const [penjualan, setPenjualan] = useState<PropsPenjualan>({
    tglAwal: null,
    tglAkhir: null,
    brand: [],
    prodDiv: [],
    prodGrp: [],
    prodCat: [],
    SBU: [],
    lokasi: [],
    klasifikasi: [],
    region: [],
  });
  const [rangeTanggalPenjualan, setRangeTanggalPenjualan] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [nilaiBrandPenjualan, setNilaiBrandPenjualan] = useState<string[]>([]);
  const [nilaiDivisiPenjualan, setNilaiDivisiPenjualan] = useState<string[]>(
    []
  );
  const [nilaiGroupPenjualan, setNilaiGroupPenjualan] = useState<string[]>([]);
  const [nilaiCatPenjualan, setNilaiCatenjualan] = useState<string[]>([]);
  const [nilaiSBUPenjualan, setNilaiSBUPenjualan] = useState<string[]>([]);
  const [nilaiLokasiPenjualan, setNilaiLokasiPenjualan] = useState<string[]>(
    []
  );
  const [nilaiKlasifikasiPenjualan, setNilaiKlasifikasiPenjualan] = useState<
    string[]
  >([]);
  const [nilaiRegionPenjualan, setNilaiRegionPenjualan] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (!sesiAktif) {
      navigasi("/");
    }
  }, [sesiAktif, navigasi]);

  // useEffect(() => {
  //   setPenjualan((penjualanSebelumnya) => ({
  //     ...penjualanSebelumnya,
  //     tglAwal: rangeTanggalPenjualan[0],
  //     tglAkhir: rangeTanggalPenjualan[1],
  //     brand: nilaiBrandPenjualan,
  //     prodDiv: nilaiDivisiPenjualan,
  //     prodGrp: nilaiGroupPenjualan,
  //     prodCat: nilaiCatPenjualan,
  //     SBU: nilaiSBUPenjualan,
  //     lokasi: nilaiLokasiPenjualan,
  //     klasifikasi: nilaiKlasifikasiPenjualan,
  //     region: nilaiRegionPenjualan,
  //   }));
  // }, [
  //   rangeTanggalPenjualan,
  //   nilaiBrandPenjualan,
  //   nilaiDivisiPenjualan,
  //   nilaiGroupPenjualan,
  //   nilaiCatPenjualan,
  //   nilaiSBUPenjualan,
  //   nilaiLokasiPenjualan,
  //   nilaiKlasifikasiPenjualan,
  //   nilaiRegionPenjualan,
  // ]);

  const handleNavlinkClick = (halamanBaru: string) => {
    dispatch(setHalaman(halamanBaru));
  };

  const renderKonten = () => {
    switch (halaman) {
      case "penjualan":
        return <Penjualan propsPenjualan={penjualan} />;
      case "penerimaanBarang":
        return <PenerimaanBarang />;
      case "stok":
        return <Stok />;
      case "ketersediaanStok":
        return <KetersediaanStok />;
      case "buyingProposal":
        return <BuyingProposal />;
      case "labaRugiToko":
        return <LabaRugiToko />;
      case "kelayakanTokoBaru":
        return <KelayakanTokoBaru />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout onNavbarLinkClick={handleNavlinkClick}>
      <Container
        sx={{
          padding: "0px",
          margin: "0px",
          minWidth: "100%",
        }}
      >
        {renderKonten()}
      </Container>
      <DrawerInput setPenjualan={setPenjualan} />
    </Layout>
  );
};

export default Konten;
