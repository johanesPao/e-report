import { useCallback, useEffect, useMemo, useState } from "react";
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

const Penjualan = ({
  propsPenjualan,
  propsMuatDataPenjualan,
  setMuatDataPenjualan,
}: {
  propsPenjualan: PropsPenjualan;
  propsMuatDataPenjualan: boolean;
  setMuatDataPenjualan: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const konekKeBc = useAppSelector(getKonekKeBC);
  const parameterBc = useAppSelector(getParameterBc);
  const dataPenjualan = useAppSelector(getDataPenjualan);
  const compPengguna = useAppSelector(getCompPengguna);
  let compKueri = useAppSelector(getCompKueri);
  const indeksData = useAppSelector(getIndeksData);

  const definisiKolom = useMemo<MRT_ColumnDef<DataPenjualan>[]>(
    () => definisiKolomPenjualan,
    []
  );

  useEffect(() => {
    listen("data-penjualan", callbackNotifikasi);
  }, []);

  const callbackNotifikasi = useCallback((e: any) => {
    console.log(e.payload);
    notifications.show({ title: e.payload, message: e.payload });
  }, []);

  useEffect(() => {
    async function tarik_data_penjualan() {
      setMuatDataPenjualan(true);
      const singleMode: boolean = compPengguna.length === 1;
      let compPRI: boolean;
      let tglAwal: string;
      let tglAkhir: string;
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
        tglAwal = propsPenjualan.tglAwal.toISOString().split("T")[0];
        tglAkhir = propsPenjualan.tglAkhir.toISOString().split("T")[0];
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
          ILEByPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          salespersonAndRegionByILEPostDate(
            parameterBc,
            tglAwal,
            tglAkhir,
            compKueri
          ),
          tokoByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          produkByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          vatByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          promoByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          diskonByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          dokumenLainnyaByILEPostDate(
            parameterBc,
            tglAwal,
            tglAkhir,
            compKueri
          ),
          quantityByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          cppuByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          rppuByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
          klasifikasiByILEPostDate(parameterBc, tglAwal, tglAkhir, compKueri),
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
            rppu: compPRI,
            setDimensi: arrDimensi,
            filterData: arrFilter,
          });
          const hasil = JSON.parse(respon);
          bacaDataPenjualan(dispatch, hasil.konten.columns);
          setMuatDataPenjualan(false);
        } catch (e) {
          setMuatDataPenjualan(false);
          console.log(e);
        }
      }
    }

    if (propsMuatDataPenjualan) {
      tarik_data_penjualan();
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
