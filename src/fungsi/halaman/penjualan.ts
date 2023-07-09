import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { notifications } from "@mantine/notifications";
import { IconBrandRust, IconCheck, IconX } from "@tabler/icons-react";

import {
  DataPenjualan,
  Dimensi,
  Filter,
  PropsInput,
  StateInputDrawer,
  dimensiBazaarOthers,
  dimensiECommerce,
  dimensiFisikFootball,
  dimensiFisikSport,
  dimensiOurDailyDose,
  dimensiWholesale,
} from "../basic";
import {
  ILEByPostDate,
  Kueri,
  cppuByILEPostDate,
  diskonByILEPostDate,
  dokumenLainnyaByILEPostDate,
  klasifikasiByILEPostDate,
  produkByILEPostDate,
  promoByILEPostDate,
  quantityByILEPostDate,
  rppuByILEPostDate,
  salespersonAndRegionByILEPostDate,
  tokoByILEPostDate,
  vatByILEPostDate,
} from "../kueri";
import { setDataPenjualan } from "../../fitur_state/dataBank";
import { setDrawerTerbuka } from "../../fitur_state/event";

export interface PropsInputPenjualan extends PropsInput {
  tglAwal: Date | null;
  tglAkhir: Date | null;
  SBU?: string[];
  lokasi?: string[];
  klasifikasi?: string[];
  region?: string[];
}

export interface StatePenjualan {
  penjualan: PropsInputPenjualan;
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
  muatDataPenjualan: boolean;
}

export interface StateInputDrawerPenjualan extends StateInputDrawer {
  rangeTanggal: [Date | null, Date | null];
  nilaiSBU: string[];
  nilaiLokasi: string[];
  nilaiKlasifikasi: string[];
  nilaiRegion: string[];
}

export const tarik_data_penjualan = async (
  dispatch: any,
  props: StatePenjualan,
  setProps: React.Dispatch<React.SetStateAction<StatePenjualan>>,
  parameterBc: {
    [key: string]: any;
  },
  compPengguna: string[],
  indeksData: number,
  compKueri: string
) => {
  const singleMode: boolean = compPengguna.length === 1;
  const compPRI: boolean = !singleMode
    ? indeksData === 0
    : compPengguna[0] === parameterBc.comp.pri;
  const compKueriFinal: string = !singleMode
    ? parameterBc.tabel_bc[
        `${
          compPRI
            ? parameterBc.comp.pri.toLowerCase()
            : parameterBc.comp.pnt.toLowerCase()
        }`
      ]
    : compKueri;

  let tglAwal: Date;
  let tglAkhir: Date;
  let tglAwalString: string;
  let tglAkhirString: string;
  let arrFilter: Filter;
  let arrKueri: Kueri[];
  let arrDimensi: Dimensi[];
  if (props.penjualan.tglAwal !== null && props.penjualan.tglAkhir !== null) {
    tglAwal = new Date(props.penjualan.tglAwal);
    tglAwal.setDate(tglAwal.getDate() + 1);
    tglAkhir = new Date(props.penjualan.tglAkhir);
    tglAkhir.setDate(tglAkhir.getDate() + 1);
    tglAwalString = tglAwal.toISOString().split("T")[0];
    tglAkhirString = tglAkhir.toISOString().split("T")[0];
    arrFilter = {
      brand: props.penjualan.brand,
      prod_div: props.penjualan.prodDiv,
      prod_grp: props.penjualan.prodGrp,
      prod_cat: props.penjualan.prodCat,
      sbu: compPRI ? props.penjualan.SBU : [],
      lokasi: compPRI ? props.penjualan.lokasi : [],
      klasifikasi: compPRI ? [] : props.penjualan.klasifikasi,
      region: compPRI ? [] : props.penjualan.region,
    };
    arrKueri = [
      ILEByPostDate(parameterBc, tglAwalString, tglAkhirString, compKueriFinal),
      salespersonAndRegionByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      tokoByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      produkByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      vatByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      promoByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      diskonByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      dokumenLainnyaByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      quantityByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      cppuByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      rppuByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
      klasifikasiByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
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
      setProps((statePenjualan) => ({
        ...statePenjualan,
        muatDataPenjualan: true,
      }));
      const respon: string = await invoke("handle_data_penjualan", {
        setKueri: arrKueri,
        compPri: compPRI,
        setDimensi: arrDimensi,
        filterData: arrFilter,
      });
      const hasil = JSON.parse(respon);
      setFilterDataPenjualan(setProps, hasil.konten.columns);
      bacaDataPenjualan(dispatch, hasil.konten.columns);
      setProps((statePenjualan) => ({
        ...statePenjualan,
        muatDataPenjualan: false,
      }));
    } catch (e) {
      setProps((statePenjualan) => ({
        ...statePenjualan,
        muatDataPenjualan: false,
      }));
      console.log(e);
    }
  }
};

const setFilterDataPenjualan = (
  setProps: React.Dispatch<React.SetStateAction<StatePenjualan>>,
  kolom: any
) => {
  setProps((statePenjualan) => ({
    ...statePenjualan,
    SBUListTabel: [...new Set<string>(kolom[3]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    kodeTokoListTabel: [...new Set<string>(kolom[4]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    tokoListTabel: [...new Set<string>(kolom[5]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    customerListTabel: [...new Set<string>(kolom[8]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    klasifikasiListTabel: [...new Set<string>(kolom[9]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    salespersonListTabel: [...new Set<string>(kolom[10]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    regionListTabel: [...new Set<string>(kolom[11]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    brandListTabel: [...new Set<string>(kolom[12]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    oricodeListTabel: [...new Set<string>(kolom[13]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    ukuranListTabel: [...new Set<string>(kolom[14]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    prodDivListTabel: [...new Set<string>(kolom[17]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    prodGrpListTabel: [...new Set<string>(kolom[18]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    prodCatListTabel: [...new Set<string>(kolom[19]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    periodListTabel: [...new Set<string>(kolom[20]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    seasonListTabel: [...new Set<string>(kolom[21]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    promoListTabel: [...new Set<string>(kolom[23]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
  }));
};

const bacaDataPenjualan = (dispatch: any, data: any[]) => {
  let arrDataPenjualan: DataPenjualan[] = [];
  let panjangArray = data[0]["values"].length;
  for (let hitung = 0; hitung < panjangArray; hitung++) {
    let postDate = new Date(data[1]["values"][hitung]);
    let systemCreatedAt = new Date(data[2]["values"][hitung]);
    arrDataPenjualan.push({
      no_entry: data[0]["values"][hitung].toLocaleString(),
      post_date: postDate.toISOString().split("T")[0],
      system_created_at: systemCreatedAt
        .toISOString()
        .split("T")[1]
        .split(".")[0],
      sbu: data[3]["values"][hitung],
      loc_code: data[4]["values"][hitung],
      toko: data[5]["values"][hitung],
      no_dokumen: data[6]["values"][hitung],
      no_dokumen_oth: data[7]["values"][hitung],
      source_no: data[8]["values"][hitung],
      classification: data[9]["values"][hitung],
      salesperson: data[10]["values"][hitung],
      region: data[11]["values"][hitung],
      brand_dim: data[12]["values"][hitung],
      oricode: data[13]["values"][hitung],
      ukuran: data[14]["values"][hitung],
      deskripsi_produk: data[15]["values"][hitung],
      warna: data[16]["values"][hitung],
      prod_div: data[17]["values"][hitung],
      prod_grp: data[18]["values"][hitung],
      prod_cat: data[19]["values"][hitung],
      period: data[20]["values"][hitung],
      season: data[21]["values"][hitung],
      ppn: data[22]["values"][hitung] !== null ? data[22]["values"][hitung] : 0,
      promo: data[23]["values"][hitung],
      diskon:
        data[24]["values"][hitung] !== null ? data[24]["values"][hitung] : 0,
      kuantitas:
        data[25]["values"][hitung] !== null ? data[25]["values"][hitung] : 0,
      cost_price_per_unit:
        data[26]["values"][hitung] !== null ? data[26]["values"][hitung] : 0,
      retail_price_per_unit:
        data[27]["values"][hitung] !== null ? data[27]["values"][hitung] : 0,
      retail_price_per_unit_aft_disc:
        data[28]["values"][hitung] !== null ? data[28]["values"][hitung] : 0,
      retail_price_per_unit_aft_vat:
        data[29]["values"][hitung] !== null ? data[29]["values"][hitung] : 0,
      total_sales_at_retail:
        data[30]["values"][hitung] !== null ? data[30]["values"][hitung] : 0,
      total_sales_at_retail_aft_disc:
        data[31]["values"][hitung] !== null ? data[31]["values"][hitung] : 0,
      total_sales_at_retail_aft_vat:
        data[32]["values"][hitung] !== null ? data[32]["values"][hitung] : 0,
      total_sales_at_cost:
        data[33]["values"][hitung] !== null ? data[33]["values"][hitung] : 0,
      total_margin_aft_vat_rp:
        data[34]["values"][hitung] !== null ? data[34]["values"][hitung] : 0,
      total_margin_aft_vat_persen:
        data[35]["values"][hitung] !== null ? data[35]["values"][hitung] : 0,
      total_bruto_aft_vat:
        data[36]["values"][hitung] !== null ? data[36]["values"][hitung] : 0,
    });
  }
  dispatch(setDataPenjualan(arrDataPenjualan));
};

export const prosesInput = (
  dispatch: any,
  props: StateInputDrawerPenjualan,
  compPengguna: string[],
  indeksData: number,
  parameterBc: { [key: string]: any },
  setProps: React.Dispatch<React.SetStateAction<StatePenjualan>>
) => {
  if (props.rangeTanggal[0] === null || props.rangeTanggal[1] === null) {
    notifications.show({
      title: "Periode Tanggal Kosong",
      message: "Harap pilih periode tanggal penarikan data penjualan",
      autoClose: 3000,
      color: "red",
      icon: React.createElement(IconX, { size: "1.1rem" }),
      withCloseButton: false,
    });
    return;
  } else if (
    props.rangeTanggal[0].toISOString() > props.rangeTanggal[1].toISOString()
  ) {
    notifications.show({
      title: "Periode Tanggal Invalid",
      message: "Tanggal awal tidak bisa lebih kecil dari tanggal akhir",
      autoClose: 3000,
      color: "red",
      icon: React.createElement(IconX, { size: "1.1rem" }),
      withCloseButton: false,
    });
    return;
  }
  setProps((statePenjualan) => ({
    ...statePenjualan,
    penjualan: {
      tglAwal: props.rangeTanggal[0],
      tglAkhir: props.rangeTanggal[1],
      brand: props.nilaiBrand,
      prodDiv: props.nilaiDiv,
      prodGrp: props.nilaiGrp,
      prodCat: props.nilaiCat,
      SBU:
        (compPengguna.length === 1 &&
          compPengguna[0] === parameterBc.comp.pri) ||
        (compPengguna.length === 2 && indeksData === 0)
          ? props.nilaiSBU
          : [],
      lokasi:
        (compPengguna.length === 1 &&
          compPengguna[0] === parameterBc.comp.pri) ||
        (compPengguna.length === 2 && indeksData === 0)
          ? props.nilaiLokasi
          : [],
      klasifikasi:
        (compPengguna.length === 1 &&
          compPengguna[0] === parameterBc.comp.pnt) ||
        (compPengguna.length === 2 && indeksData === 1)
          ? props.nilaiKlasifikasi
          : [],
      region:
        (compPengguna.length === 1 &&
          compPengguna[0] === parameterBc.comp.pnt) ||
        (compPengguna.length === 2 && indeksData === 1)
          ? props.nilaiRegion
          : [],
    },
  }));
  dispatch(setDrawerTerbuka(false));
  setProps((statePenjualan) => ({
    ...statePenjualan,
    muatDataPenjualan: true,
  }));
};

export const callbackNotifikasiPenjualan = (e: any) => {
  switch (e.payload.state) {
    case "start": {
      notifications.show({
        id: e.event,
        title: "Proses Penarikan Data Penjualan",
        message: e.payload.konten,
        autoClose: false,
        color: "black",
        icon: React.createElement(IconBrandRust),
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
        icon: React.createElement(IconCheck),
        withCloseButton: false,
      });
      break;
    }
    default: {
      break;
    }
  }
};

export const unduhExcel = () => {};
