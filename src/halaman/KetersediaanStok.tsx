import { Center, Title } from "@mantine/core";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { useAppDispatch, useAppSelector } from "../state/hook";
import {
  StateKetersediaanStok,
  callbackNotifikasiKetersediaanStok,
  tarik_data_ketersediaan_stok,
} from "../fungsi/halaman/ketersediaanStok";
import { getParameterBc } from "../fitur_state/dataParam";
import { getDataKetersediaanStok } from "../fitur_state/dataBank";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import { useCallback, useEffect, useMemo } from "react";
import { MRT_ColumnDef } from "mantine-react-table";
import { DataKetersediaanStok } from "../fungsi/basic";
import { definisiKolomKetersediaanStok } from "../fungsi/kolom_data";
import { listen } from "@tauri-apps/api/event";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { Tabel } from "../komponen/Tabel";

const KetersediaanStok = ({
  props,
  setProps,
}: {
  props: StateKetersediaanStok;
  setProps: React.Dispatch<React.SetStateAction<StateKetersediaanStok>>;
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const dataKetersediaanStok = useAppSelector(getDataKetersediaanStok);
  const compPengguna = useAppSelector(getCompPengguna);
  const compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);

  const definisiKolom = useMemo<MRT_ColumnDef<DataKetersediaanStok>[]>(
    () => definisiKolomKetersediaanStok(props),
    [
      props.lokasiListTabel,
      props.brandListTabel,
      props.oricodeListTabel,
      props.ukuranListTabel,
      props.seasonListTabel,
      props.periodListTabel,
      props.prodDivListTabel,
      props.prodGrpListTabel,
      props.prodCatListTabel,
      props.itemDiscGroupListTabel,
    ]
  );

  const callbackNotifikasi = useCallback((e: any) => {
    callbackNotifikasiKetersediaanStok(e);
  }, []);

  useEffect(() => {
    if (props.muatKetersediaanStok) {
      const unlisten = listen("data-ketersediaan-stok", callbackNotifikasi);
      tarik_data_ketersediaan_stok(
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
  }, [props.ketersediaanStok]);

  return (
    <>
      <TombolDrawer
        label="Input Parameter Data Ketersediaan Stok"
        nonAktif={konekKeBc}
        aksiRedux={dispatch}
        warna="teal"
      />
      <div style={{ padding: "25px" }}>
        {dataKetersediaanStok.length === 0 && !props.muatKetersediaanStok ? (
          <Center sx={{ height: "100%", opacity: 0.5 }}>
            <Title>Tidak ada data yang dimuat</Title>
          </Center>
        ) : (
          <Tabel
            arrKolom={definisiKolom}
            arrData={dataKetersediaanStok}
            memuatData={props.muatKetersediaanStok}
          />
        )}
      </div>
    </>
  );
};

export default KetersediaanStok;
