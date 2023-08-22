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
import { StatePenjualan } from "../fungsi/halaman/penjualan";
import { StatePenerimaanBarang } from "../fungsi/halaman/penerimaanBarang";
import { StateStok } from "../fungsi/halaman/stok";
import { StateKetersediaanStok } from "../fungsi/halaman/ketersediaanStok";
import { StateLabaRugiToko } from "../fungsi/halaman/labaRugiToko";
import {
  StateKelayakanTokoBaru,
  ambilInputItemModelKelayakanTokoBaru,
  ambilProposal,
} from "../fungsi/halaman/kelayakanTokoBaru";
import { EHalaman, resetAplikasi } from "../fungsi/basic";
import { StatePopUp } from "./PopUp";

const Konten = () => {
  const navigasi = useNavigate();
  const dispatch = useAppDispatch();
  const sesiAktif = useAppSelector(getSesiAktif);
  const halaman = useAppSelector(getHalaman);

  // PENJUALAN
  const initialStatePenjualan: StatePenjualan = {
    penjualan: {
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
    },
    SBUListTabel: [],
    kodeTokoListTabel: [],
    tokoListTabel: [],
    customerListTabel: [],
    klasifikasiListTabel: [],
    salespersonListTabel: [],
    regionListTabel: [],
    brandListTabel: [],
    oricodeListTabel: [],
    ukuranListTabel: [],
    prodDivListTabel: [],
    prodGrpListTabel: [],
    prodCatListTabel: [],
    periodListTabel: [],
    seasonListTabel: [],
    promoListTabel: [],
    muatDataPenjualan: false,
  };
  const [statePenjualan, setStatePenjualan] = useState(initialStatePenjualan);

  // PENERIMAAN BARANG
  const initialStatePenerimaanBarang: StatePenerimaanBarang = {
    penerimaanBarang: {
      tglAwal: null,
      tglAkhir: null,
      brand: [],
      prodDiv: [],
      prodGrp: [],
      prodCat: [],
      lokasi: [],
    },
    brandListTabel: [],
    oricodeListTabel: [],
    ukuranListTabel: [],
    prodDivListTabel: [],
    prodGrpListTabel: [],
    prodCatListTabel: [],
    lokasiListTabel: [],
    muatDataPenerimaanBarang: false,
  };
  const [statePenerimaanBarang, setStatePenerimaanBarang] = useState(
    initialStatePenerimaanBarang
  );

  // STOK
  const initialStateStok: StateStok = {
    stok: {
      tglAkhir: null,
      brand: [],
      prodDiv: [],
      prodGrp: [],
      prodCat: [],
      lokasi: [],
    },
    brandListTabel: [],
    oricodeListTabel: [],
    ukuranListTabel: [],
    seasonListTabel: [],
    periodListTabel: [],
    prodDivListTabel: [],
    prodGrpListTabel: [],
    prodCatListTabel: [],
    lokasiListTabel: [],
    muatDataStok: false,
  };
  const [stateStok, setStateStok] = useState(initialStateStok);

  // KETERSEDIAAN STOK
  const initialStateKetersediaanStok: StateKetersediaanStok = {
    ketersediaanStok: {
      brand: [],
      prodDiv: [],
      prodGrp: [],
      prodCat: [],
      lokasi: [],
    },
    brandListTabel: [],
    oricodeListTabel: [],
    ukuranListTabel: [],
    seasonListTabel: [],
    periodListTabel: [],
    prodDivListTabel: [],
    prodGrpListTabel: [],
    prodCatListTabel: [],
    itemDiscGroupListTabel: [],
    lokasiListTabel: [],
    muatKetersediaanStok: false,
  };
  const [stateKetersediaanStok, setStateKetersediaanStok] = useState(
    initialStateKetersediaanStok
  );

  // LABA RUGI TOKO
  const initialStateLabaRugiToko: StateLabaRugiToko = {
    labaRugiToko: {
      tglAwal: null,
      tglAkhir: null,
    },
    muatDataLabaRugiToko: false,
  };
  const [stateLabaRugiToko, setStateLabaRugiToko] = useState(
    initialStateLabaRugiToko
  );

  // KELAYAKAN TOKO BARU
  const initialStateKelayakanTokoBaru: StateKelayakanTokoBaru = {
    tampilanTabel: [],
    dataKelayakanTokoBaru: [],
    muatTabelKelayakanTokoBaru: false,
    popUp: {
      togglePopUp: false,
      judulPopUp: undefined,
    },
    inputItem: {
      sbuItem: [],
      rentangPopulasiItem: [],
      kelasMallItem: [],
      umrItem: [],
      model: {
        namaModelUrl: "",
        namaModel: "",
        versi: "",
        mean: "",
        std: "",
      },
    },
  };
  const [stateKelayakanTokoBaru, setStateKelayakanTokoBaru] = useState(
    initialStateKelayakanTokoBaru
  );

  // POP UP
  const initialStatePopUp: StatePopUp = {
    togglePopUp: false,
  };

  const [popUp, setPopUp] = useState(initialStatePopUp);

  useEffect(() => {
    async function proposalDanInput() {
      await ambilProposal(dispatch, setStateKelayakanTokoBaru);
      await ambilInputItemModelKelayakanTokoBaru(setStateKelayakanTokoBaru);
    }

    if (!popUp.togglePopUp) {
      proposalDanInput();
    }
  }, [popUp.togglePopUp]);

  useEffect(() => {
    if (!sesiAktif) {
      navigasi("/");
    }
  }, [sesiAktif, navigasi]);

  const handleNavlinkClick = (halamanBaru: string) => {
    dispatch(setHalaman(halamanBaru));
  };

  // resetAplikasi(dispatch);

  const renderKonten = () => {
    switch (halaman) {
      case EHalaman.PENJUALAN:
        return (
          <Penjualan props={statePenjualan} setProps={setStatePenjualan} />
        );
      case EHalaman.PENERIMAAN_BARANG:
        return (
          <PenerimaanBarang
            props={statePenerimaanBarang}
            setProps={setStatePenerimaanBarang}
          />
        );
      case EHalaman.STOK:
        return <Stok props={stateStok} setProps={setStateStok} />;
      case EHalaman.KETERSEDIAAN_STOK:
        return (
          <KetersediaanStok
            props={stateKetersediaanStok}
            setProps={setStateKetersediaanStok}
          />
        );
      case EHalaman.BUYING_PROPOSAL:
        return <BuyingProposal />;
      case EHalaman.LABA_RUGI_TOKO:
        return (
          <LabaRugiToko
            props={stateLabaRugiToko}
            setProps={setStateLabaRugiToko}
          />
        );
      case EHalaman.KELAYAKAN_TOKO_BARU:
        return (
          <KelayakanTokoBaru
            props={stateKelayakanTokoBaru}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  const renderDrawer = () => {
    switch (halaman) {
      case EHalaman.PENJUALAN:
        return <DrawerInput setPropsPenjualan={setStatePenjualan} />;
      case EHalaman.PENERIMAAN_BARANG:
        return (
          <DrawerInput setPropsPenerimaanBarang={setStatePenerimaanBarang} />
        );
      case EHalaman.STOK:
        return <DrawerInput setPropsStok={setStateStok} />;
      case EHalaman.KETERSEDIAAN_STOK:
        return (
          <DrawerInput setPropsKetersediaanStok={setStateKetersediaanStok} />
        );
      case EHalaman.BUYING_PROPOSAL:
        return null;
      case EHalaman.LABA_RUGI_TOKO:
        return <DrawerInput setPropsLabaRugiToko={setStateLabaRugiToko} />;
      case EHalaman.KELAYAKAN_TOKO_BARU:
        return null;
      default:
        return null;
    }
  };

  return (
    <Layout onNavbarLinkClick={handleNavlinkClick}>
      <Container
        sx={{
          padding: "0px",
          marginTop: "0px",
          minWidth: "100%",
        }}
      >
        {renderKonten()}
      </Container>
      {renderDrawer()}
    </Layout>
  );
};

export default Konten;
