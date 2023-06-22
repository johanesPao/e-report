import React, { useCallback, useEffect, useMemo } from "react";
import { listen } from "@tauri-apps/api/event";
import { MRT_ColumnDef } from "mantine-react-table";
import { Center, Title } from "@mantine/core";

import { useAppDispatch, useAppSelector } from "../state/hook";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { StatePenjualan } from "../fungsi/halaman/penjualan";
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
  props,
  setProps,
}: {
  props: StatePenjualan;
  setProps: React.Dispatch<React.SetStateAction<StatePenjualan>>;
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const dataPenjualan = useAppSelector(getDataPenjualan);
  const compPengguna = useAppSelector(getCompPengguna);
  const compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);

  const definisiKolom = useMemo<MRT_ColumnDef<DataPenjualan>[]>(
    () => definisiKolomPenjualan(props),
    [
      props.SBUListTabel,
      props.kodeTokoListTabel,
      props.tokoListTabel,
      props.customerListTabel,
      props.klasifikasiListTabel,
      props.salespersonListTabel,
      props.regionListTabel,
      props.brandListTabel,
      props.oricodeListTabel,
      props.ukuranListTabel,
      props.prodDivListTabel,
      props.prodGrpListTabel,
      props.prodCatListTabel,
      props.periodListTabel,
      props.seasonListTabel,
      props.promoListTabel,
    ]
  );

  const callbackNotifikasi = useCallback((e: any) => {
    callbackNotifikasiPenjualan(e);
  }, []);

  useEffect(() => {
    if (props.muatDataPenjualan) {
      const unlisten = listen("data-penjualan", callbackNotifikasi);
      tarik_data_penjualan(
        dispatch,
        props,
        setProps,
        parameterBc,
        compPengguna,
        indeksData,
        compKueri
      );
      return () => {
        unlisten.then((f) => f());
      };
    }
  }, [props.penjualan]);

  return (
    <>
      <TombolDrawer
        label="Input Parameter Data Penjualan"
        nonAktif={konekKeBc}
        aksiRedux={dispatch}
        warna="teal"
      />
      <div style={{ padding: "25px" }}>
        {dataPenjualan.length === 0 && !props.muatDataPenjualan ? (
          <Center sx={{ height: "100%", opacity: 0.5 }}>
            <Title>Tidak ada data yang dimuat</Title>
          </Center>
        ) : (
          <Tabel
            arrKolom={definisiKolom}
            arrData={dataPenjualan}
            memuatData={props.muatDataPenjualan}
          />
        )}
      </div>
    </>
  );
};

export default Penjualan;
