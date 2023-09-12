import { invoke } from "@tauri-apps/api/tauri";
import {
  DataInvoiceExtGRN,
  DataPenerimaanBarang,
  Filter,
  PropsInput,
  StateInputDrawer,
} from "../basic";
import {
  Kueri,
  noDokPurInvDanExtDok,
  penerimaanBarangByILEPostDate,
} from "../kueri";
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
  let arrGRNKueri: Kueri[];
  let arrDokKueri: Kueri[];
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
    arrGRNKueri = [
      penerimaanBarangByILEPostDate(
        parameterBc,
        tglAwalString,
        tglAkhirString,
        compKueriFinal
      ),
    ];
    arrDokKueri = [noDokPurInvDanExtDok(parameterBc, compKueriFinal)];

    try {
      setProps((statePenerimaanBarang) => ({
        ...statePenerimaanBarang,
        muatDataPenerimaanBarang: true,
      }));
      // fungsi async GRN
      const goodsReceivedData = async (
        setKueri: Kueri[],
        arrFilter: Filter
      ) => {
        const respon: string = await invoke("handle_data_penerimaan_barang", {
          setKueri,
          filterData: arrFilter,
        });
        return await JSON.parse(respon);
      };
      // fungsu async dokumen invoice dan external dok
      const invoiceDanExtDokData = async (setKueri: Kueri[]) => {
        const respon: string = await invoke("handle_data_invoice_ext_grn", {
          setKueri,
        });
        return await JSON.parse(respon);
      };
      // Promise all async
      const [GRNData, invoiceExtDokData] = await Promise.all([
        goodsReceivedData(arrGRNKueri, arrFilter),
        invoiceDanExtDokData(arrDokKueri),
      ]);

      // jika GRNData true
      if (GRNData.status) {
        // setFilterDataPenerimaanBarang(setProps, GRNData.konten.columns);
        // bacaDataPenerimaanBarang(dispatch, GRNData.konten.columns);
        // buat penampung array object DataInvoiceExtGRN
        let arrInvExtGRN: DataInvoiceExtGRN[] = [];
        // jika invoiceExtDokData true
        if (invoiceExtDokData.status) {
          // buat array object DataInvoiceExtGRN
          let dataInvoiceExtGRN = invoiceExtDokData.konten.columns;
          for (
            let hitung = 0;
            hitung < dataInvoiceExtGRN[0]["values"].length;
            hitung++
          ) {
            let invExtGRN: DataInvoiceExtGRN = {
              no_dokumen_pr: dataInvoiceExtGRN[0]["values"][hitung],
              no_dokumen_piv: dataInvoiceExtGRN[1]["values"][hitung],
              no_dokumen_ext: dataInvoiceExtGRN[2]["values"][hitung],
              oricode: dataInvoiceExtGRN[3]["values"][hitung],
              ukuran: dataInvoiceExtGRN[4]["values"][hitung],
            };
            arrInvExtGRN.push(invExtGRN);
          }
          console.log(arrInvExtGRN);
        }
        bacaDataPenerimaanBarang(
          dispatch,
          GRNData.konten.columns,
          invoiceExtDokData.status ? arrInvExtGRN : undefined
        );
        setProps((statePenerimaanBarang) => ({
          ...statePenerimaanBarang,
          muatDataPenerimaanBarang: false,
        }));
      }
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

const bacaDataPenerimaanBarang = (
  dispatch: any,
  dataGRN: any[],
  dataInvExt?: DataInvoiceExtGRN[]
) => {
  let arrDataPenerimaanBarang: DataPenerimaanBarang[] = [];
  let panjangArray = dataGRN[0]["values"].length;
  for (let hitung = 0; hitung < panjangArray; hitung++) {
    let postDate = new Date(dataGRN[1]["values"][hitung]);
    // inisiasi no_dokumen_piv dan no_dokumen_vendor
    let [no_dokumen_piv, no_dokumen_vendor] = ["", ""];
    // EXTRACT PURCHASE INVOICE
    // jika dataInvExt tidak undefined
    if (dataInvExt !== undefined) {
      // buat array purchase receipt berdasar dataGRN[2]["values"][hitung], dataGRN[7]["values"][hitung] dan
      // dataGRN[10]["values"][hitung]
      const arrPRT = dataInvExt.filter((dokumen) => {
        return (
          dokumen.no_dokumen_pr === dataGRN[2]["values"][hitung] &&
          dokumen.oricode === dataGRN[7]["values"][hitung] &&
          dokumen.ukuran === dataGRN[10]["values"][hitung]
        );
      });
      const arrPRTLength = arrPRT.length;
      // jika arrPRTLength <= 0, break
      switch (arrPRTLength > 0) {
        // jika arrPRTLength > 0
        case true:
          // unik no_dokumen_piv
          const unikNoDokumenPIV = [
            ...new Set<string>(arrPRT.map((dokumen) => dokumen.no_dokumen_piv)),
          ];
          const unikNoDokumenVendor = [
            ...new Set<string>(arrPRT.map((dokumen) => dokumen.no_dokumen_ext)),
          ];
          no_dokumen_piv =
            unikNoDokumenPIV.length === 1
              ? arrPRT[0].no_dokumen_piv
              : unikNoDokumenPIV.join(", ");
          no_dokumen_vendor =
            unikNoDokumenVendor.length === 1
              ? arrPRT[0].no_dokumen_ext
              : unikNoDokumenVendor.join(", ");
          break;
        default:
          break;
      }
    }

    arrDataPenerimaanBarang.push({
      no_entry: dataGRN[0]["values"][hitung].toLocaleString(),
      post_date: postDate.toISOString().split("T")[0],
      no_dokumen_pr: dataGRN[2]["values"][hitung],
      no_dokumen_piv,
      no_dokumen_vendor,
      no_dokumen_wr: dataGRN[3]["values"][hitung],
      no_dokumen_po: dataGRN[4]["values"][hitung],
      loc_code: dataGRN[5]["values"][hitung],
      brand_dim: dataGRN[6]["values"][hitung],
      oricode: dataGRN[7]["values"][hitung],
      deskripsi_produk: dataGRN[8]["values"][hitung],
      warna: dataGRN[9]["values"][hitung],
      ukuran: dataGRN[10]["values"][hitung],
      prod_div: dataGRN[11]["values"][hitung],
      prod_grp: dataGRN[12]["values"][hitung],
      prod_cat: dataGRN[13]["values"][hitung],
      retail_price_per_unit:
        dataGRN[14]["values"][hitung] !== null
          ? dataGRN[14]["values"][hitung]
          : 0,
      goods_received_quantity:
        dataGRN[15]["values"][hitung] !== null
          ? dataGRN[15]["values"][hitung]
          : 0,
      goods_received_cost:
        dataGRN[16]["values"][hitung] !== null
          ? dataGRN[16]["values"][hitung]
          : 0,
    });
  }
  console.log(arrDataPenerimaanBarang);
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
        title: "Penarikan Data Penerimaan Barang Selesai",
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
