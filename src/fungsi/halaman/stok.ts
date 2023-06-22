import { invoke } from "@tauri-apps/api/tauri";
import { DataStok, Filter, PropsInput, StateInputDrawer } from "../basic";
import { Kueri, endingStokByILE } from "../kueri";
import { setDataStok } from "../../fitur_state/dataBank";
import { notifications } from "@mantine/notifications";
import { IconBrandRust, IconCheck, IconX } from "@tabler/icons-react";
import React from "react";
import { setDrawerTerbuka } from "../../fitur_state/event";

export interface PropsInputStok extends PropsInput {
  tglAkhir: Date | null;
  lokasi: string[];
}

export interface StateStok {
  stok: PropsInputStok;
  brandListTabel: string[];
  oricodeListTabel: string[];
  ukuranListTabel: string[];
  seasonListTabel: string[];
  periodListTabel: string[];
  prodDivListTabel: string[];
  prodGrpListTabel: string[];
  prodCatListTabel: string[];
  lokasiListTabel: string[];
  muatDataStok: boolean;
}

export interface StateInputDrawerStok extends StateInputDrawer {
  tglStok: Date | null;
  nilaiLokasi: string[];
}

export const tarik_data_stok = async (
  dispatch: any,
  props: StateStok,
  setProps: React.Dispatch<React.SetStateAction<StateStok>>,
  parameterBc: { [key: string]: any },
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

  let tglStok: Date;
  let tglStokString: string;
  let arrFilter: Filter;
  let arrKueri: Kueri[];
  if (props.stok.tglAkhir !== null) {
    tglStok = new Date(props.stok.tglAkhir);
    tglStok.setDate(tglStok.getDate() + 1);
    tglStokString = tglStok.toISOString().split("T")[0];
    arrFilter = {
      brand: props.stok.brand,
      prod_div: props.stok.prodDiv,
      prod_grp: props.stok.prodGrp,
      prod_cat: props.stok.prodCat,
      lokasi: props.stok.lokasi,
    };
    arrKueri = [endingStokByILE(parameterBc, tglStokString, compKueriFinal)];

    try {
      setProps((stateStok) => ({
        ...stateStok,
        muatDataStok: true,
      }));
      const respon: string = await invoke("handle_data_stok", {
        setKueri: arrKueri,
        filterData: arrFilter,
      });
      const hasil = JSON.parse(respon);
      setFilterDataStok(setProps, hasil.konten.columns);
      bacaDataStok(dispatch, hasil.konten.columns);
      setProps((stateStok) => ({
        ...stateStok,
        muatDataStok: false,
      }));
    } catch (e) {
      setProps((stateStok) => ({
        ...stateStok,
        muatDataStok: false,
      }));
      console.log(e);
    }
  }
};

const setFilterDataStok = (
  setProps: React.Dispatch<React.SetStateAction<StateStok>>,
  kolom: any
) => {
  setProps((stateStok) => ({
    ...stateStok,
    brandListTabel: [...new Set<string>(kolom[1]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    oricodeListTabel: [...new Set<string>(kolom[2]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    ukuranListTabel: [...new Set<string>(kolom[5]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    seasonListTabel: [...new Set<string>(kolom[6]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    periodListTabel: [...new Set<string>(kolom[7]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    prodDivListTabel: [...new Set<string>(kolom[8]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    prodGrpListTabel: [...new Set<string>(kolom[9]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    prodCatListTabel: [...new Set<string>(kolom[10]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    lokasiListTabel: [...new Set<string>(kolom[0]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
  }));
};

const bacaDataStok = (dispatch: any, data: any[]) => {
  let arrDataStok: DataStok[] = [];
  let panjangArray = data[0]["values"].length;
  for (let hitung = 0; hitung < panjangArray; hitung++) {
    arrDataStok.push({
      loc_code: data[0]["values"][hitung],
      brand_dim: data[1]["values"][hitung],
      oricode: data[2]["values"][hitung],
      deskripsi_produk: data[3]["values"][hitung],
      warna: data[4]["values"][hitung],
      ukuran: data[5]["values"][hitung],
      season: data[6]["values"][hitung],
      period: data[7]["values"][hitung],
      prod_div: data[8]["values"][hitung],
      prod_grp: data[9]["values"][hitung],
      prod_cat: data[10]["values"][hitung],
      retail_price_per_unit:
        data[11]["values"][hitung] !== null ? data[11]["values"][hitung] : 0,
      stock_quantity:
        data[12]["values"][hitung] !== null ? data[12]["values"][hitung] : 0,
      stock_cost:
        data[13]["values"][hitung] !== null ? data[13]["values"][hitung] : 0,
    });
  }
  dispatch(setDataStok(arrDataStok));
};

export const prosesInput = (
  dispatch: any,
  props: StateInputDrawerStok,
  setProps: React.Dispatch<React.SetStateAction<StateStok>>
) => {
  if (props.tglStok === null) {
    notifications.show({
      title: "Tanggal Tidak Terpilih",
      message: "Harap pilih tanggal penarikan data stok",
      autoClose: 3000,
      color: "red",
      icon: React.createElement(IconX, { size: "1.1rem" }),
      withCloseButton: false,
    });
    return;
  }
  setProps((stateStok) => ({
    ...stateStok,
    stok: {
      tglAkhir: props.tglStok,
      brand: props.nilaiBrand,
      prodDiv: props.nilaiDiv,
      prodGrp: props.nilaiGrp,
      prodCat: props.nilaiCat,
      lokasi: props.nilaiLokasi,
    },
  }));
  dispatch(setDrawerTerbuka(false));
  setProps((stateStok) => ({
    ...stateStok,
    muatDataStok: true,
  }));
};

export const callbackNotifikasiStok = (e: any) => {
  switch (e.payload.state) {
    case "start": {
      notifications.show({
        id: e.event,
        title: "Proses Penarikan Data Stok",
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
        title: "Proses Penarikan Data Stok",
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
        title: "Penarikan Data Stok Selesai",
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
