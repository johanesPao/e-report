import { invoke } from "@tauri-apps/api/tauri";
import { Kueri, store_pnl } from "../kueri";
import { DataLabaRugiToko } from "../basic";
import { setDataLabaRugiToko } from "../../fitur_state/dataBank";
import { setDrawerTerbuka } from "../../fitur_state/event";
import { notifications } from "@mantine/notifications";
import { IconBrandRust, IconCheck } from "@tabler/icons-react";
import React from "react";

export interface PropsInputLabaRugiToko {
  tglAwal: Date | null;
  tglAkhir: Date | null;
}

export interface StateLabaRugiToko {
  labaRugiToko: PropsInputLabaRugiToko;
  muatDataLabaRugiToko: boolean;
}

export interface StateInputDrawerLabaRugiToko {
  rangeTanggal: [Date | null, Date | null];
}

export const tarik_data_laba_rugi_toko = async (
  dispatch: any,
  props: StateLabaRugiToko,
  setProps: React.Dispatch<React.SetStateAction<StateLabaRugiToko>>,
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

  let tglAwal: Date;
  let tglAkhir: Date;
  let tglAwalString: string;
  let tglAkhirString: string;
  let arrKueri: Kueri[];
  if (
    props.labaRugiToko.tglAwal !== null &&
    props.labaRugiToko.tglAkhir !== null
  ) {
    tglAwal = new Date(props.labaRugiToko.tglAwal);
    tglAwal.setDate(tglAwal.getDate() + 1);
    tglAkhir = new Date(props.labaRugiToko.tglAkhir);
    tglAkhir.setDate(tglAkhir.getDate() + 1);
    tglAwalString = tglAwal.toISOString().split("T")[0];
    tglAkhirString = tglAkhir.toISOString().split("T")[0];
    arrKueri = [
      store_pnl(parameterBc, tglAwalString, tglAkhirString, compKueriFinal),
    ];

    try {
      setProps((stateLabaRugiToko) => ({
        ...stateLabaRugiToko,
        muatDataLabaRugiToko: true,
      }));
      const respon: string = await invoke("handle_data_laba_rugi_toko", {
        setKueri: arrKueri,
      });
      const hasil = JSON.parse(respon);
      bacaDataLabaRugiToko(dispatch, hasil.konten.columns);
      setProps((stateLabaRugiToko) => ({
        ...stateLabaRugiToko,
        muatDataLabaRugiToko: false,
      }));
    } catch (e) {
      setProps((stateLabaRugiToko) => ({
        ...stateLabaRugiToko,
        muatDataLabaRugiToko: false,
      }));
      console.log(e);
    }
  }
};

const bacaDataLabaRugiToko = (dispatch: any, data: any[]) => {
  const coaUnik = [...new Set<string>(data[0]["values"])];
  const storeCodeUnik = [...new Set<string>(data[2]["values"])];
  let arrDataLabaRugiToko: DataLabaRugiToko[] = [];
  let panjangArray = data[0]["values"].length;
  for (let hitung = 0; hitung < panjangArray; hitung++) {
    arrDataLabaRugiToko.push({
      coa: data[0]["values"][hitung],
      acc_name: data[1]["values"][hitung],
      store_code: data[2]["values"][hitung],
      store_desc: data[3]["values"][hitung],
      amount:
        data[4]["values"][hitung] !== null ? data[4]["values"][hitung] : 0,
    });
  }
  let arrDataLabaRugiTokoTransform: DataLabaRugiToko[] = [];
  for (var coa of coaUnik) {
    let dataCoAStore: DataLabaRugiToko = {
      coa: coa,
      acc_name:
        arrDataLabaRugiToko[
          arrDataLabaRugiToko.findIndex((item) => item.coa === coa)
        ]["acc_name"],
    };
    for (var storeCode of storeCodeUnik) {
      const indeks = arrDataLabaRugiToko.findIndex(
        (item) => item.coa === coa && item.store_code === storeCode
      );
      dataCoAStore = {
        ...dataCoAStore,
        [storeCode]: indeks === -1 ? 0 : arrDataLabaRugiToko[indeks]["amount"],
      };
    }
    arrDataLabaRugiTokoTransform.push(dataCoAStore);
  }
  dispatch(setDataLabaRugiToko(arrDataLabaRugiTokoTransform));
};

export const prosesInput = (
  dispatch: any,
  props: StateInputDrawerLabaRugiToko,
  setProps: React.Dispatch<React.SetStateAction<StateLabaRugiToko>>
) => {
  setProps((stateLabaRugiToko) => ({
    ...stateLabaRugiToko,
    labaRugiToko: {
      tglAwal: props.rangeTanggal[0],
      tglAkhir: props.rangeTanggal[1],
    },
  }));
  dispatch(setDrawerTerbuka(false));
  setProps((stateLabaRugiToko) => ({
    ...stateLabaRugiToko,
    muatDataLabaRugiToko: true,
  }));
};

export const callbackNotifikasiLabaRugiToko = (e: any) => {
  switch (e.payload.state) {
    case "start": {
      notifications.show({
        id: e.event,
        title: "Proses Penarikan Data Laba Rugi Toko",
        message: e.payload.konten,
        autoClose: 2000,
        color: "black",
        icon: React.createElement(IconBrandRust),
        withCloseButton: false,
      });
      break;
    }
    case "update": {
      notifications.show({
        id: e.event,
        title: "Proses Penarikan Data Laba Rugi Toko",
        message: e.payload.konten,
        autoClose: false,
        color: "orange",
        loading: true,
        withCloseButton: false,
      });
      break;
    }
    case "finish": {
      notifications.show({
        id: e.event,
        title: "Penarikan Data Laba Rugi Toko Selesai",
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
