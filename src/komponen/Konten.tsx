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
  const [muatDataPenjualan, setMuatDataPenjualan] = useState(false);

  useEffect(() => {
    if (!sesiAktif) {
      navigasi("/");
    }
  }, [sesiAktif, navigasi]);

  const handleNavlinkClick = (halamanBaru: string) => {
    dispatch(setHalaman(halamanBaru));
  };

  const renderKonten = () => {
    switch (halaman) {
      case "penjualan":
        return (
          <Penjualan
            propsPenjualan={penjualan}
            propsMuatDataPenjualan={muatDataPenjualan}
            setMuatDataPenjualan={setMuatDataPenjualan}
          />
        );
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
      <DrawerInput
        setPenjualan={setPenjualan}
        setMuatDataPenjualan={setMuatDataPenjualan}
      />
    </Layout>
  );
};

export default Konten;
