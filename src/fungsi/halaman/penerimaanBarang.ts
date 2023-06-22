import { invoke } from "@tauri-apps/api/tauri";
import {
  DataPenerimaanBarang,
  Filter,
  PropsInput,
  StateInputDrawer,
} from "../basic";
import { Kueri, penerimaanBarangByILEPostDate } from "../kueri";
import { setDataPenerimaanBarang } from "../../fitur_state/dataBank";
import { notifications } from "@mantine/notifications";
import React from "react";
import { IconBrandRust, IconCheck, IconX } from "@tabler/icons-react";
import { setDrawerTerbuka } from "../../fitur_state/event";

export interface PropsInputPenerimaanBarang extends PropsInput {
  tglAwal: Date | null;
  tglAkhir: Date | null;
  lokasi: string[];
}

export interface StatePenerimaanBarang {
  penerimaanBarang: PropsInputPenerimaanBarang;
  brandListTabel: string[];
  prodDivListTabel: string[];
  prodGrpListTabel: string[];
  prodCatListTabel: string[];
  oricodeListTabel: string[];
  ukuranListTabel: string[];
  lokasiListTabel: string[];
  muatDataPenerimaanBarang: boolean;
}

export interface StateInputDrawerPenerimaanBarang extends StateInputDrawer {
  rangeTanggal: [Date | null, Date | null];
  nilaiLokasi: string[];
}

export const tarik_data_penerimaan_barang = async (
  dispatch: any,
  props: StatePenerimaanBarang,
  setProps: React.Dispatch<React.SetStateAction<StatePenerimaanBarang>>,
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
  if (
    props.penerimaanBarang.tglAwal !== null &&
    props.penerimaanBarang.tglAkhir !== null
  ) {
    tglAwal = new Date(props.penerimaanBarang.tglAwal);
    tglAwal.setDate(tglAwal.getDate() + 1);
    tglAkhir = new Date(props.penerimaanBarang.tglAkhir);
    tglAkhir.setDate(tglAkhir.getDate() + 1);
    tglAwalString = tglAwal.toISOString().split("T")[0];
    tglAkhirString = tglAkhir.toISOString().split("T")[0];
    arrFilter = {
      brand: props.penerimaanBarang.brand,
      prod_div: props.penerimaanBarang.prodDiv,
      prod_grp: props.penerimaanBarang.prodGrp,
      prod_cat: props.penerimaanBarang.prodCat,
      lokasi: props.penerimaanBarang.lokasi,
    };
    arrKueri = [
      penerimaanBarangByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
    ];

    try {
      setProps((statePenerimaanBarang) => ({
        ...statePenerimaanBarang,
        muatDataPenerimaanBarang: true,
      }));
      const respon: string = await invoke("handle_data_penerimaan_barang", {
        setKueri: arrKueri,
        filterData: arrFilter,
      });
      const hasil = JSON.parse(respon);
      setFilterDataPenerimaanBarang(setProps, hasil.konten.columns);
      bacaDataPenerimaanBarang(dispatch, hasil.konten.columns);
      setProps((statePenerimaanBarang) => ({
        ...statePenerimaanBarang,
        muatDataPenerimaanBarang: false,
      }));
    } catch (e) {
      setProps((statePenerimaanBarang) => ({
        ...statePenerimaanBarang,
        muatDataPenerimaanBarang: false,
      }));
      console.log(e);
    }
  }
};

const setFilterDataPenerimaanBarang = (
  setProps: React.Dispatch<React.SetStateAction<StatePenerimaanBarang>>,
  kolom: any
) => {
  setProps((statePenerimaanBarang) => ({
    ...statePenerimaanBarang,
    brandListTabel: [...new Set<string>(kolom[6]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
    prodDivListTabel: [...new Set<string>(kolom[11]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    prodGrpListTabel: [...new Set<string>(kolom[12]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    prodCatListTabel: [...new Set<string>(kolom[13]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    oricodeListTabel: [...new Set<string>(kolom[7]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    ukuranListTabel: [...new Set<string>(kolom[10]["values"])].map(
      (item: any) => (item !== null ? item : "")
    ),
    lokasiListTabel: [...new Set<string>(kolom[5]["values"])].map((item: any) =>
      item !== null ? item : ""
    ),
  }));
};

const bacaDataPenerimaanBarang = (dispatch: any, data: any[]) => {
  let arrDataPenerimaanBarang: DataPenerimaanBarang[] = [];
  let panjangArray = data[0]["values"].length;
  for (let hitung = 0; hitung < panjangArray; hitung++) {
    let postDate = new Date(data[1]["values"][hitung]);
    arrDataPenerimaanBarang.push({
      no_entry: data[0]["values"][hitung].toLocaleString(),
      post_date: postDate.toISOString().split("T")[0],
      no_dokumen_pr: data[2]["values"][hitung],
      no_dokumen_wr: data[3]["values"][hitung],
      no_dokumen_po: data[4]["values"][hitung],
      loc_code: data[5]["values"][hitung],
      brand_dim: data[6]["values"][hitung],
      oricode: data[7]["values"][hitung],
      deskripsi_produk: data[8]["values"][hitung],
      warna: data[9]["values"][hitung],
      ukuran: data[10]["values"][hitung],
      prod_div: data[11]["values"][hitung],
      prod_grp: data[12]["values"][hitung],
      prod_cat: data[13]["values"][hitung],
      retail_price_per_unit:
        data[14]["values"][hitung] !== null
          ? data[14]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      goods_received_quantity:
        data[15]["values"][hitung] !== null
          ? data[15]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      goods_received_cost:
        data[16]["values"][hitung] !== null
          ? data[16]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
    });
  }
  dispatch(setDataPenerimaanBarang(arrDataPenerimaanBarang));
};

export const prosesInput = (
  dispatch: any,
  props: StateInputDrawerPenerimaanBarang,
  setProps: React.Dispatch<React.SetStateAction<StatePenerimaanBarang>>
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
  setProps((statePenerimaanBarang) => ({
    ...statePenerimaanBarang,
    penerimaanBarang: {
      tglAwal: props.rangeTanggal[0],
      tglAkhir: props.rangeTanggal[1],
      brand: props.nilaiBrand,
      prodDiv: props.nilaiDiv,
      prodGrp: props.nilaiGrp,
      prodCat: props.nilaiCat,
      lokasi: props.nilaiLokasi,
    },
  }));
  dispatch(setDrawerTerbuka(false));
  setProps((statePenerimaanBarang) => ({
    ...statePenerimaanBarang,
    muatDataPenerimaanBarang: true,
  }));
};

export const callbackNotifikasiPenerimaanBarang = (e: any) => {
  switch (e.payload.state) {
    case "start": {
      notifications.show({
        id: e.event,
        title: "Proses Penarikan Data Penerimaan Barang",
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
        title: "Proses Penarikan Data Penerimaan Barang",
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
