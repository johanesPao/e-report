import { useCallback, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

import { useAppDispatch, useAppSelector } from "../state/hook";
import { getIndeksData, getKonekKeBC } from "../fitur_state/event";
import { TombolDrawer } from "../komponen/TombolDrawer";
import { PropsPenjualan } from "../komponen/Konten";
import {
  ILEByPostDate,
  cppuByILEPostDate,
  diskonByILEPostDate,
  dokumenLainnyaByILEPostDate,
  klasifikasiByILEPostDate,
  produkByILEPostDate,
  promoByILEPostDate,
  quantityByILEPostDate,
  rppuByILEPostDate,
  salespersonAndRegionByILEPostDate,
  Kueri,
  tokoByILEPostDate,
  vatByILEPostDate,
} from "../fungsi/kueri";
import { getParameterBc } from "../fitur_state/dataParam";
import { getCompKueri, getCompPengguna } from "../fitur_state/pengguna";
import {
  DataPenjualan,
  Dimensi,
  Filter,
  dimensiBazaarOthers,
  dimensiECommerce,
  dimensiFisikFootball,
  dimensiFisikSport,
  dimensiOurDailyDose,
  dimensiWholesale,
} from "../fungsi/basic";
import { Tabel } from "../komponen/Tabel";
import {
  definisiKolomPenjualan,
  bacaDataPenjualan,
} from "../fungsi/kolom_data";
import { MRT_ColumnDef } from "mantine-react-table";
import { Center, Title } from "@mantine/core";
import { getDataPenjualan } from "../fitur_state/dataBank";
import { notifications } from "@mantine/notifications";
import { IconBrandRust, IconCheck } from "@tabler/icons-react";

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
    console.log(e.payload);
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
    async function tarik_data_penjualan() {
      setMuatDataPenjualan(true);
      const singleMode: boolean = compPengguna.length === 1;
      let compPRI: boolean;
      let tglAwal: Date;
      let tglAkhir: Date;
      let tglAwalString: string;
      let tglAkhirString: string;
      let arrFilter: Filter;
      let arrKueri: Kueri[];
      let arrDimensi: Dimensi[];

      if (!singleMode) {
        compKueri =
          parameterBc.tabel_bc[
            `${
              indeksData
                ? parameterBc.comp.pnt.toLowerCase()
                : parameterBc.comp.pri.toLowerCase()
            }`
          ];
        compPRI = indeksData == 0;
      } else {
        compPRI = compPengguna[0] === parameterBc.comp.pri;
      }

      if (propsPenjualan.tglAwal !== null && propsPenjualan.tglAkhir !== null) {
        tglAwal = new Date(propsPenjualan.tglAwal);
        tglAkhir = new Date(propsPenjualan.tglAkhir);
        tglAwal.setDate(tglAwal.getDate() + 1);
        tglAkhir.setDate(tglAkhir.getDate() + 1);
        tglAwalString = tglAwal.toISOString().split("T")[0];
        tglAkhirString = tglAkhir.toISOString().split("T")[0];
        arrFilter = {
          brand: propsPenjualan.brand,
          prod_div: propsPenjualan.prodDiv,
          prod_grp: propsPenjualan.prodGrp,
          prod_cat: propsPenjualan.prodCat,
          sbu: compPRI ? propsPenjualan.SBU : [],
          lokasi: compPRI ? propsPenjualan.lokasi : [],
          klasifikasi: compPRI ? [] : propsPenjualan.klasifikasi,
          region: compPRI ? [] : propsPenjualan.region,
        };
        arrKueri = [
          ILEByPostDate(parameterBc, tglAwalString, tglAkhirString, compKueri),
          salespersonAndRegionByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          tokoByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          produkByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          vatByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          promoByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          diskonByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          dokumenLainnyaByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          quantityByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          cppuByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          rppuByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
          klasifikasiByILEPostDate(
            parameterBc,
            tglAwalString,
            tglAkhirString,
            compKueri
          ),
        ];

        arrDimensi = [
          dimensiECommerce(parameterBc),
          dimensiFisikSport(parameterBc),
          dimensiFisikFootball(parameterBc),
          dimensiOurDailyDose(parameterBc),
          dimensiWholesale(parameterBc),
          dimensiBazaarOthers(parameterBc),
        ];

        try {
          const respon: string = await invoke("handle_data_penjualan", {
            setKueri: arrKueri,
            compPri: compPRI,
            setDimensi: arrDimensi,
            filterData: arrFilter,
          });
          const hasil = JSON.parse(respon);
          setSBUListTabel([
            ...new Set<string>(hasil.konten.columns[3]["values"]),
          ]);
          bacaDataPenjualan(dispatch, hasil.konten.columns);
          setMuatDataPenjualan(false);
        } catch (e) {
          setMuatDataPenjualan(false);
          console.log(e);
        }
      }
    }

    if (propsMuatDataPenjualan) {
      const unlisten = listen("data-penjualan", callbackNotifikasi);
      tarik_data_penjualan();
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
