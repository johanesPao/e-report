import { Center, Title } from "@mantine/core";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { useAppDispatch, useAppSelector } from "../state/hook";
import {
  StateStok,
  callbackNotifikasiStok,
  tarik_data_stok,
} from "../fungsi/halaman/stok";
import { getParameterBc } from "../fitur_state/dataParam";
import { getDataStok } from "../fitur_state/dataBank";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import { useCallback, useEffect, useMemo } from "react";
import { MRT_ColumnDef } from "mantine-react-table";
import { DataStok } from "../fungsi/basic";
import { definisiKolomStok } from "../fungsi/kolom_data";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { Tabel } from "../komponen/Tabel";
import { listen } from "@tauri-apps/api/event";

const Stok = ({
  props,
  setProps,
}: {
  props: StateStok;
  setProps: React.Dispatch<React.SetStateAction<StateStok>>;
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const dataStok = useAppSelector(getDataStok);
  const compPengguna = useAppSelector(getCompPengguna);
  const compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);

  const definisiKolom = useMemo<MRT_ColumnDef<DataStok>[]>(
    () => definisiKolomStok(props),
    [
      props.brandListTabel,
      props.oricodeListTabel,
      props.ukuranListTabel,
      props.seasonListTabel,
      props.periodListTabel,
      props.prodDivListTabel,
      props.prodGrpListTabel,
      props.prodCatListTabel,
      props.lokasiListTabel,
    ]
  );

  const callbackNotifikasi = useCallback((e: any) => {
    callbackNotifikasiStok(e);
  }, []);

  useEffect(() => {
    if (props.muatDataStok) {
      const unlisten = listen("data-stok", callbackNotifikasi);
      tarik_data_stok(
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
  }, [props.stok]);

  return (
    <>
      <TombolDrawer
        label="Input Parameter Data Stok"
        nonAktif={konekKeBc}
        aksiRedux={dispatch}
        warna="teal"
      />
      <div style={{ padding: "25px" }}>
        {dataStok.length === 0 && !props.muatDataStok ? (
          <Center sx={{ height: "100%", opacity: 0.5 }}>
            <Title>Tidak ada data yang dimuat</Title>
          </Center>
        ) : (
          <Tabel
            arrKolom={definisiKolom}
            arrData={dataStok}
            memuatData={props.muatDataStok}
          />
        )}
      </div>
    </>
  );
};

export default Stok;
