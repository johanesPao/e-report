import { useCallback, useEffect, useMemo } from "react";
import { listen } from "@tauri-apps/api/event";
import { MRT_ColumnDef } from "mantine-react-table";
import { Center, Title } from "@mantine/core";

import { useAppDispatch, useAppSelector } from "../state/hook";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { PropsPenjualan } from "../komponen/Konten";
import { getParameterBc } from "../fitur_state/dataParam";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import { DataPenjualan } from "../fungsi/basic";
import { Tabel } from "../komponen/Tabel";
import { definisiKolomPenjualan } from "../fungsi/kolom_data";
import { getDataPenjualan } from "../fitur_state/dataBank";
import {
  callbackNotifikasiPenjualan,
  tarik_data_penjualan,
} from "../fungsi/halaman/penjualan";

const Penjualan = ({
  propsPenjualan,
  propsMuatDataPenjualan,
  setMuatDataPenjualan,
  setSBUListTabel,
  setKodeTokoListTabel,
  setTokoListTabel,
  setCustomerListTabel,
  setKlasifikasiListTabel,
  setSalespersonListTabel,
  setRegionListTabel,
  setBrandListTabel,
  setOricodeListTabel,
  setUkuranListTabel,
  setProdDivListTabel,
  setProdGrpListTabel,
  setProdCatListTabel,
  setPeriodListTabel,
  setSeasonListTabel,
  setPromoListTabel,
  SBUListTabel,
  kodeTokoListTabel,
  tokoListTabel,
  customerListTabel,
  klasifikasiListTabel,
  salespersonListTabel,
  regionListTabel,
  brandListTabel,
  oricodeListTabel,
  ukuranListTabel,
  prodDivListTabel,
  prodGrpListTabel,
  prodCatListTabel,
  periodListTabel,
  seasonListTabel,
  promoListTabel,
}: {
  propsPenjualan: PropsPenjualan;
  propsMuatDataPenjualan: boolean;
  setMuatDataPenjualan: React.Dispatch<React.SetStateAction<boolean>>;
  setSBUListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setKodeTokoListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setTokoListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setCustomerListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setKlasifikasiListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setSalespersonListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setRegionListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setBrandListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setOricodeListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setUkuranListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setProdDivListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setProdGrpListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setProdCatListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setPeriodListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setSeasonListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  setPromoListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  SBUListTabel: string[];
  kodeTokoListTabel: string[];
  tokoListTabel: string[];
  customerListTabel: string[];
  klasifikasiListTabel: string[];
  salespersonListTabel: string[];
  regionListTabel: string[];
  brandListTabel: string[];
  oricodeListTabel: string[];
  ukuranListTabel: string[];
  prodDivListTabel: string[];
  prodGrpListTabel: string[];
  prodCatListTabel: string[];
  periodListTabel: string[];
  seasonListTabel: string[];
  promoListTabel: string[];
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const dataPenjualan = useAppSelector(getDataPenjualan);
  const compPengguna = useAppSelector(getCompPengguna);
  let compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);

  const definisiKolom = useMemo<MRT_ColumnDef<DataPenjualan>[]>(
    () =>
      definisiKolomPenjualan(
        SBUListTabel,
        kodeTokoListTabel,
        tokoListTabel,
        customerListTabel,
        klasifikasiListTabel,
        salespersonListTabel,
        regionListTabel,
        brandListTabel,
        oricodeListTabel,
        ukuranListTabel,
        prodDivListTabel,
        prodGrpListTabel,
        prodCatListTabel,
        periodListTabel,
        seasonListTabel,
        promoListTabel
      ),
    [
      SBUListTabel,
      kodeTokoListTabel,
      tokoListTabel,
      customerListTabel,
      klasifikasiListTabel,
      salespersonListTabel,
      regionListTabel,
      brandListTabel,
      oricodeListTabel,
      ukuranListTabel,
      prodDivListTabel,
      prodGrpListTabel,
      prodCatListTabel,
      periodListTabel,
      seasonListTabel,
      promoListTabel,
    ]
  );

  const callbackNotifikasi = useCallback((e: any) => {
    callbackNotifikasiPenjualan(e);
  }, []);

  useEffect(() => {
    if (propsMuatDataPenjualan) {
      const unlisten = listen("data-penjualan", callbackNotifikasi);
      tarik_data_penjualan(
        dispatch,
        setMuatDataPenjualan,
        parameterBc,
        compPengguna,
        indeksData,
        compKueri,
        propsPenjualan,
        setSBUListTabel,
        setKodeTokoListTabel,
        setTokoListTabel,
        setCustomerListTabel,
        setKlasifikasiListTabel,
        setSalespersonListTabel,
        setRegionListTabel,
        setBrandListTabel,
        setOricodeListTabel,
        setUkuranListTabel,
        setProdDivListTabel,
        setProdGrpListTabel,
        setProdCatListTabel,
        setPeriodListTabel,
        setSeasonListTabel,
        setPromoListTabel
      );
      return () => {
        unlisten.then((f) => f());
      };
    }
  }, [propsPenjualan]);

  return (
    <>
      <TombolDrawer
        label="Input Parameter Penjualan"
        nonAktif={konekKeBc}
        aksiRedux={dispatch}
        warna="teal"
      />
      <div style={{ padding: "25px" }}>
        {dataPenjualan.length === 0 && !propsMuatDataPenjualan ? (
          <Center sx={{ height: "100%", opacity: 0.5 }}>
            <Title>Tidak ada data yang dimuat</Title>
          </Center>
        ) : (
          <Tabel
            arrKolom={definisiKolom}
            arrData={dataPenjualan}
            memuatData={propsMuatDataPenjualan}
          />
        )}
      </div>
    </>
  );
};

export default Penjualan;
