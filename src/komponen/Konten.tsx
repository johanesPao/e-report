import { useEffect } from "react";
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
import { getKonekKeBC } from "../fitur_state/event";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import {
  BrandLabel,
  getParameterBc,
  setParameterBrand,
} from "../fitur_state/dataParam";
import { useAppSelector, useAppDispatch } from "../state/hook";
import { Container } from "@mantine/core";
import { brandLabel } from "../fungsi/bc";

const Konten = () => {
  const navigasi = useNavigate();
  const dispatch = useAppDispatch();
  const sesiAktif = useAppSelector(getSesiAktif);
  const halaman = useAppSelector(getHalaman);
  const koneksiBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const compKueri = useAppSelector(getCompKueri);
  const compPengguna = useAppSelector(getCompPengguna);

  const muatBrand = async () => {
    const arrayBrandLabel: BrandLabel[][] = [];
    if (compPengguna.length === 1) {
      const respon = await brandLabel(parameterBc, compKueri);
      if (respon !== undefined && respon.length !== 0) {
        arrayBrandLabel.push(respon);
        dispatch(setParameterBrand(arrayBrandLabel));
      }
    } else {
      const brandLabelPromises = compPengguna.map(async (comp) => {
        const respon = await brandLabel(
          parameterBc,
          parameterBc.tabel_bc[comp.toLowerCase()]
        );
        if (respon !== undefined && respon.length !== 0) {
          return respon;
        }
      });

      const brandLabelJamak = await Promise.all(brandLabelPromises);
      const brandLabelValid = brandLabelJamak.filter(
        (hasil): hasil is BrandLabel[] => hasil !== undefined
      );
      arrayBrandLabel.push(...brandLabelValid);
      dispatch(setParameterBrand(arrayBrandLabel));
    }
  };

  useEffect(() => {
    if (!sesiAktif) {
      navigasi("/");
    }
  }, [sesiAktif, navigasi]);

  useEffect(() => {
    if (koneksiBc) {
      muatBrand();
    }
  }, [koneksiBc]);

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
      <DrawerInput />
    </Layout>
  );
};

export default Konten;
