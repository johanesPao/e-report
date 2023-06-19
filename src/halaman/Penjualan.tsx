import { useCallback, useEffect, useMemo } from "react";
import { listen } from "@tauri-apps/api/event";

import { useAppDispatch, useAppSelector } from "../state/hook";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { PropsPenjualan } from "../komponen/Konten";
import { getParameterBc } from "../fitur_state/dataParam";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import { DataPenjualan } from "../fungsi/basic";
import { Tabel } from "../komponen/Tabel";
import { definisiKolomPenjualan } from "../fungsi/kolom_data";
import { MRT_ColumnDef } from "mantine-react-table";
import { Center, Title } from "@mantine/core";
import { getDataPenjualan } from "../fitur_state/dataBank";
import { notifications } from "@mantine/notifications";
import { IconBrandRust, IconCheck } from "@tabler/icons-react";
import { tarik_data_penjualan } from "../fungsi/halaman/penjualan";

const Penjualan = ({
  propsPenjualan,
  propsMuatDataPenjualan,
  setMuatDataPenjualan,
  setSBUListTabel,
  SBUListTabel,
}: {
  propsPenjualan: PropsPenjualan;
  propsMuatDataPenjualan: boolean;
  setMuatDataPenjualan: React.Dispatch<React.SetStateAction<boolean>>;
  setSBUListTabel: React.Dispatch<React.SetStateAction<string[]>>;
  SBUListTabel: string[];
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const dataPenjualan = useAppSelector(getDataPenjualan);
  const compPengguna = useAppSelector(getCompPengguna);
  let compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);

  const definisiKolom = useMemo<MRT_ColumnDef<DataPenjualan>[]>(
    () => definisiKolomPenjualan(SBUListTabel),
    [SBUListTabel]
  );

  const callbackNotifikasi = useCallback((e: any) => {
    switch (e.payload.state) {
      case "start": {
        notifications.show({
          id: e.event,
          title: "Proses Penarikan Data Penjualan",
          message: e.payload.konten,
          autoClose: false,
          color: "black",
          icon: <IconBrandRust />,
          withCloseButton: false,
        });
        break;
      }
      case "update": {
        notifications.update({
          id: e.event,
          title: "Proses Penarikan Data Penjualan",
          message: e.payload.konten,
          autoClose: false,
          color: "orange",
          loading: true,
          withCloseButton: false,
        });
        break;
      }
      case "finish": {
        notifications.update({
          id: e.event,
          title: "Penarikan Data Selesai",
          message: e.payload.konten,
          autoClose: 3000,
          color: "green",
          icon: <IconCheck />,
          withCloseButton: false,
        });
        break;
      }
      default: {
        break;
      }
    }
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
        setSBUListTabel
      );
      console.log(propsMuatDataPenjualan);
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
