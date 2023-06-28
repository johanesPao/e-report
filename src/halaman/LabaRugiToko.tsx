import { Center, Title } from "@mantine/core";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { useAppDispatch, useAppSelector } from "../state/hook";
import {
  StateLabaRugiToko,
  callbackNotifikasiLabaRugiToko,
  tarik_data_laba_rugi_toko,
} from "../fungsi/halaman/labaRugiToko";
import { getParameterBc } from "../fitur_state/dataParam";
import { getDataLabaRugiToko } from "../fitur_state/dataBank";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import { useCallback, useEffect, useState } from "react";
import { MRT_ColumnDef } from "mantine-react-table";
import { definisiKolomLabaRugiToko } from "../fungsi/kolom_data";
import { listen } from "@tauri-apps/api/event";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { Tabel } from "../komponen/Tabel";

const LabaRugiToko = ({
  props,
  setProps,
}: {
  props: StateLabaRugiToko;
  setProps: React.Dispatch<React.SetStateAction<StateLabaRugiToko>>;
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const dataLabaRugiToko = useAppSelector(getDataLabaRugiToko);
  const compPengguna = useAppSelector(getCompPengguna);
  const compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);
  const kolomDef: MRT_ColumnDef<any>[] = [
    {
      accessorKey: "coa_placeholder",
      header: "Chart of Account",
    },
    {
      accessorKey: "acc_name_placeholder",
      header: "Acc. Name",
    },
    {
      accessorKey: "store_placeholder",
      header: "Toko",
    },
  ];
  const [kolomState, setKolomState] = useState(kolomDef);

  useEffect(() => {
    if (dataLabaRugiToko.length !== 0) {
      setKolomState(definisiKolomLabaRugiToko(dataLabaRugiToko));
    }
  }, [dataLabaRugiToko]);

  const callbackNotifikasi = useCallback((e: any) => {
    callbackNotifikasiLabaRugiToko(e);
  }, []);

  useEffect(() => {
    if (props.muatDataLabaRugiToko) {
      const unlisten = listen("data-laba-rugi-toko", callbackNotifikasi);
      tarik_data_laba_rugi_toko(
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
  }, [props.labaRugiToko]);

  return (
    <>
      <TombolDrawer
        label="Input Parameter Data Laba Rugi Toko"
        nonAktif={konekKeBc}
        aksiRedux={dispatch}
        warna="teal"
      />
      <div style={{ padding: "25px" }}>
        {dataLabaRugiToko.length === 0 && !props.muatDataLabaRugiToko ? (
          <Center sx={{ height: "100%", opacity: 0.5 }}>
            <Title>Tidak ada data yang dimuat</Title>
          </Center>
        ) : (
          <Tabel
            arrKolom={kolomState}
            arrData={dataLabaRugiToko}
            memuatData={props.muatDataLabaRugiToko}
          />
        )}
      </div>
    </>
  );
};

export default LabaRugiToko;
