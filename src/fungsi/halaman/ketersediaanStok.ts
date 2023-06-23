import { invoke } from "@tauri-apps/api/tauri";
import {
  DataKetersediaanStok,
  Filter,
  PropsInput,
  StateInputDrawer,
} from "../basic";
import { Kueri, ketersediaanStokByILE } from "../kueri";
import { setDataKetersediaanStok } from "../../fitur_state/dataBank";
import { setDrawerTerbuka } from "../../fitur_state/event";
import { notifications } from "@mantine/notifications";
import React from "react";
import { IconBrandRust, IconCheck } from "@tabler/icons-react";

export interface PropsInputKetersediaanStok extends PropsInput {
  lokasi: string[];
}

export interface StateKetersediaanStok {
  ketersediaanStok: PropsInputKetersediaanStok;
  lokasiListTabel: string[];
  brandListTabel: string[];
  oricodeListTabel: string[];
  ukuranListTabel: string[];
  seasonListTabel: string[];
  periodListTabel: string[];
  prodDivListTabel: string[];
  prodGrpListTabel: string[];
  prodCatListTabel: string[];
  itemDiscGroupListTabel: string[];
  muatKetersediaanStok: boolean;
}

export interface StateInputDrawerKetersediaanStok extends StateInputDrawer {
  nilaiLokasi: string[];
}

export const tarik_data_ketersediaan_stok = async (
  dispatch: any,
  props: StateKetersediaanStok,
  setProps: React.Dispatch<React.SetStateAction<StateKetersediaanStok>>,
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

  const arrFilter: Filter = {
    brand: props.ketersediaanStok.brand,
    prod_div: props.ketersediaanStok.prodDiv,
    prod_grp: props.ketersediaanStok.prodGrp,
    prod_cat: props.ketersediaanStok.prodCat,
    lokasi: props.ketersediaanStok.lokasi,
  };
  const arrKueri: Kueri[] = [
    ketersediaanStokByILE(parameterBc, compKueriFinal),
  ];

  try {
    setProps((stateKetersediaanStok) => ({
      ...stateKetersediaanStok,
      muatKetersediaanStok: true,
    }));
    const respon: string = await invoke("handle_data_ketersediaan_stok", {
      setKueri: arrKueri,
      filterData: arrFilter,
    });
    const hasil = JSON.parse(respon);
    setFilterDataKetersediaanStok(setProps, hasil.konten.columns);
    bacaDataKetersediaanStok(dispatch, hasil.konten.columns);
    setProps((stateKetersediaanStok) => ({
      ...stateKetersediaanStok,
      muatKetersediaanStok: false,
    }));
  } catch (e) {
    setProps((stateKetersediaanStok) => ({
      ...stateKetersediaanStok,
      muatKetersediaanStok: false,
    }));
    console.log(e);
  }
};

const setFilterDataKetersediaanStok = (
  setProps: React.Dispatch<React.SetStateAction<StateKetersediaanStok>>,
  kolom: any
) => {
  setProps((stateKetersediaanStok) => ({
    ...stateKetersediaanStok,
    lokasiListTabel: [...new Set<string>(kolom[0]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    brandListTabel: [...new Set<string>(kolom[1]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    oricodeListTabel: [...new Set<string>(kolom[2]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    ukuranListTabel: [...new Set<string>(kolom[3]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    seasonListTabel: [...new Set<string>(kolom[4]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    periodListTabel: [...new Set<string>(kolom[5]["values"])].map((item: any) =>
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
    itemDiscGroupListTabel: [...new Set<string>(kolom[11]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
  }));
};

const bacaDataKetersediaanStok = (dispatch: any, data: any[]) => {
  let arrDataKetersediaanStok: DataKetersediaanStok[] = [];
  let panjangArray = data[0]["values"].length;
  for (let hitung = 0; hitung < panjangArray; hitung++) {
    arrDataKetersediaanStok.push({
      loc_code: data[0]["values"][hitung],
      brand_dim: data[1]["values"][hitung],
      oricode: data[2]["values"][hitung],
      ukuran: data[3]["values"][hitung],
      season: data[4]["values"][hitung],
      period: data[5]["values"][hitung],
      deskripsi_produk: data[6]["values"][hitung],
      warna: data[7]["values"][hitung],
      prod_div: data[8]["values"][hitung],
      prod_grp: data[9]["values"][hitung],
      prod_cat: data[10]["values"][hitung],
      item_disc_group: data[11]["values"][hitung],
      retail_price_per_unit:
        data[12]["values"][hitung] !== null ? data[12]["values"][hitung] : 0,
      stock_on_hand:
        data[13]["values"][hitung] !== null ? data[13]["values"][hitung] : 0,
      total_cost:
        data[14]["values"][hitung] !== null ? data[14]["values"][hitung] : 0,
      po_outstanding_qty:
        data[15]["values"][hitung] !== null ? data[15]["values"][hitung] : 0,
      so_outstanding_qty:
        data[16]["values"][hitung] !== null ? data[16]["values"][hitung] : 0,
      proj_stock_intake:
        data[17]["values"][hitung] !== null ? data[17]["values"][hitung] : 0,
      proj_stock_aft_so:
        data[18]["values"][hitung] !== null ? data[18]["values"][hitung] : 0,
    });
  }
  dispatch(setDataKetersediaanStok(arrDataKetersediaanStok));
};

export const prosesInput = (
  dispatch: any,
  props: StateInputDrawerKetersediaanStok,
  setProps: React.Dispatch<React.SetStateAction<StateKetersediaanStok>>
) => {
  setProps((stateKetersediaanStok) => ({
    ...stateKetersediaanStok,
    ketersediaanStok: {
      brand: props.nilaiBrand,
      prodDiv: props.nilaiDiv,
      prodGrp: props.nilaiGrp,
      prodCat: props.nilaiCat,
      lokasi: props.nilaiLokasi,
    },
  }));
  dispatch(setDrawerTerbuka(false));
  setProps((stateKetersediaanStok) => ({
    ...stateKetersediaanStok,
    muatKetersediaanStok: true,
  }));
};

export const callbackNotifikasiKetersediaanStok = (e: any) => {
  switch (e.payload.state) {
    case "start": {
      notifications.show({
        id: e.event,
        title: "Proses Penarikan Data Ketersediaan Stok",
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
        title: "Proses Penarikan Data Ketersediaan Stok",
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
        title: "Penarikan Data Ketersediaan Stok Selesai",
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
