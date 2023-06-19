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

  // PENJUALAN
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
  const [SBUListTabel, setSBUListTabel] = useState<string[]>([]);
  const [kodeTokoListTabel, setKodeTokoListTabel] = useState<string[]>([]);
  const [tokoListTabel, setTokoListTabel] = useState<string[]>([]);
  const [customerListTabel, setCustomerListTabel] = useState<string[]>([]);
  const [klasifikasiListTabel, setKlasifikasiListTabel] = useState<string[]>(
    []
  );
  const [salespersonListTabel, setSalespersonListTabel] = useState<string[]>(
    []
  );
  const [regionListTabel, setRegionListTabel] = useState<string[]>([]);
  const [brandListTabel, setBrandListTabel] = useState<string[]>([]);
  const [oricodeListTabel, setOricodeListTabel] = useState<string[]>([]);
  const [ukuranListTabel, setUkuranListTabel] = useState<string[]>([]);
  const [prodDivListTabel, setProdDivListTabel] = useState<string[]>([]);
  const [prodGrpListTabel, setKProdGrpListTabel] = useState<string[]>([]);
  const [prodCatListTabel, setProdCatListTabel] = useState<string[]>([]);
  const [periodListTabel, setPeriodListTabel] = useState<string[]>([]);
  const [seasonListTabel, setSeasonListTabel] = useState<string[]>([]);
  const [promoListTabel, setPromoListTabel] = useState<string[]>([]);
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
            setSBUListTabel={setSBUListTabel}
            setKodeTokoListTabel={setKodeTokoListTabel}
            setTokoListTabel={setTokoListTabel}
            setCustomerListTabel={setCustomerListTabel}
            setKlasifikasiListTabel={setKlasifikasiListTabel}
            setSalespersonListTabel={setSalespersonListTabel}
            setRegionListTabel={setRegionListTabel}
            setBrandListTabel={setBrandListTabel}
            setOricodeListTabel={setOricodeListTabel}
            setUkuranListTabel={setUkuranListTabel}
            setProdDivListTabel={setProdDivListTabel}
            setProdGrpListTabel={setKProdGrpListTabel}
            setProdCatListTabel={setProdCatListTabel}
            setPeriodListTabel={setPeriodListTabel}
            setSeasonListTabel={setSeasonListTabel}
            setPromoListTabel={setPromoListTabel}
            SBUListTabel={SBUListTabel}
            kodeTokoListTabel={kodeTokoListTabel}
            tokoListTabel={tokoListTabel}
            customerListTabel={customerListTabel}
            klasifikasiListTabel={klasifikasiListTabel}
            salespersonListTabel={salespersonListTabel}
            regionListTabel={regionListTabel}
            brandListTabel={brandListTabel}
            oricodeListTabel={oricodeListTabel}
            ukuranListTabel={ukuranListTabel}
            prodDivListTabel={prodDivListTabel}
            prodGrpListTabel={prodGrpListTabel}
            prodCatListTabel={prodCatListTabel}
            periodListTabel={periodListTabel}
            seasonListTabel={seasonListTabel}
            promoListTabel={promoListTabel}
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
