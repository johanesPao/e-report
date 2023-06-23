import { Center, Title } from "@mantine/core";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { useAppDispatch, useAppSelector } from "../state/hook";
import {
  StatePenerimaanBarang,
  callbackNotifikasiPenerimaanBarang,
  tarik_data_penerimaan_barang,
} from "../fungsi/halaman/penerimaanBarang";
import { getParameterBc } from "../fitur_state/dataParam";
import { getDataPenerimaanBarang } from "../fitur_state/dataBank";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import { useCallback, useEffect, useMemo } from "react";
import { MRT_ColumnDef } from "mantine-react-table";
import { DataPenerimaanBarang } from "../fungsi/basic";
import { definisiKolomPenerimaanBarang } from "../fungsi/kolom_data";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { Tabel } from "../komponen/Tabel";
import { listen } from "@tauri-apps/api/event";

const PenerimaanBarang = ({
  props,
  setProps,
}: {
  props: StatePenerimaanBarang;
  setProps: React.Dispatch<React.SetStateAction<StatePenerimaanBarang>>;
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const dataPenerimaanBarang = useAppSelector(getDataPenerimaanBarang);
  const compPengguna = useAppSelector(getCompPengguna);
  const compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);

  const definisiKolom = useMemo<MRT_ColumnDef<DataPenerimaanBarang>[]>(
    () => definisiKolomPenerimaanBarang(props),
    [
      props.brandListTabel,
      props.prodDivListTabel,
      props.prodGrpListTabel,
      props.prodCatListTabel,
      props.oricodeListTabel,
      props.ukuranListTabel,
      props.lokasiListTabel,
    ]
  );

  const callbackNotifikasi = useCallback((e: any) => {
    callbackNotifikasiPenerimaanBarang(e);
  }, []);

  useEffect(() => {
    if (props.muatDataPenerimaanBarang) {
      const unlisten = listen("data-penerimaan-barang", callbackNotifikasi);
      tarik_data_penerimaan_barang(
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
  }, [props.penerimaanBarang]);

  return (
    <>
      <TombolDrawer
        label="Input Parameter Data Penerimaan Barang"
        nonAktif={konekKeBc}
        aksiRedux={dispatch}
        warna="teal"
      />
      <div style={{ padding: "25px" }}>
        {dataPenerimaanBarang.length === 0 &&
        !props.muatDataPenerimaanBarang ? (
          <Center sx={{ height: "100%", opacity: 0.5 }}>
            <Title>Tidak ada data yang dimuat</Title>
          </Center>
        ) : (
          <Tabel
            arrKolom={definisiKolom}
            arrData={dataPenerimaanBarang}
            memuatData={props.muatDataPenerimaanBarang}
          />
        )}
      </div>
    </>
  );
};

export default PenerimaanBarang;
