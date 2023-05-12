import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const Konten = () => {
  const navigasi = useNavigate();
  const dispatch = useAppDispatch();
  const sesiAktif = useAppSelector(getSesiAktif);
  const halaman = useAppSelector(getHalaman);

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
        return <Penjualan />;
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
    <Layout onNavbarLinkClick={handleNavlinkClick}>{renderKonten()}</Layout>
  );
};

export default Konten;
