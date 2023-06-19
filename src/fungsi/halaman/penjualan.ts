import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { notifications } from "@mantine/notifications";
import { IconBrandRust, IconCheck, IconX } from "@tabler/icons-react";

import { PropsPenjualan } from "../../komponen/Konten";
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

export const tarik_data_penjualan = async (
  dispatch: any,
  setMuatDataPenjualan: React.Dispatch<React.SetStateAction<boolean>>,
  parameterBc: {
    [key: string]: any;
  },
  compPengguna: string[],
  indeksData: number,
  compKueri: string,
  propsPenjualan: PropsPenjualan,
  setSBUListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setKodeTokoListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setTokoListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setCustomerListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setKlasifikasiListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setSalespersonListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setRegionListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setBrandListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setOricodeListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setUkuranListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setProdDivListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setProdGrpListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setProdCatListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setPeriodListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setSeasonListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setPromoListTabel: React.Dispatch<React.SetStateAction<string[]>>
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
  if (propsPenjualan.tglAwal !== null && propsPenjualan.tglAkhir !== null) {
    tglAwal = new Date(propsPenjualan.tglAwal);
    tglAwal.setDate(tglAwal.getDate() + 1);
    tglAkhir = new Date(propsPenjualan.tglAkhir);
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
      setMuatDataPenjualan(true);
      const respon: string = await invoke("handle_data_penjualan", {
        setKueri: arrKueri,
        compPri: compPRI,
        setDimensi: arrDimensi,
        filterData: arrFilter,
      });
      const hasil = JSON.parse(respon);
      setFilterDataPenjualan(
        setSBUListTabel,
        setKodeTokoListTabel,
        setTokoListTabel,
        setCustomerListTabel,
        setKlasifikasiListTabel,
        setSalespersonListTabel,
        setRegionListTabel,
        setBrandListTabel,
        setOricodeListTabel,
        setUkuranListTabel,
        setProdDivListTabel,
        setProdGrpListTabel,
        setProdCatListTabel,
        setPeriodListTabel,
        setSeasonListTabel,
        setPromoListTabel,
        hasil.konten.columns
      );
      bacaDataPenjualan(dispatch, hasil.konten.columns);
      setMuatDataPenjualan(false);
    } catch (e) {
      setMuatDataPenjualan(false);
      console.log(e);
    }
  }
};

const setFilterDataPenjualan = (
  setSBUListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setKodeTokoListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setTokoListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setCustomerListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setKlasifikasiListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setSalespersonListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setRegionListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setBrandListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setOricodeListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setUkuranListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setProdDivListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setProdGrpListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setProdCatListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setPeriodListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setSeasonListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  setPromoListTabel: React.Dispatch<React.SetStateAction<string[]>>,
  kolom: any
) => {
  setSBUListTabel(
    [...new Set<string>(kolom[3]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setKodeTokoListTabel(
    [...new Set<string>(kolom[4]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setTokoListTabel(
    [...new Set<string>(kolom[5]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setCustomerListTabel(
    [...new Set<string>(kolom[8]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setKlasifikasiListTabel(
    [...new Set<string>(kolom[9]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setSalespersonListTabel(
    [...new Set<string>(kolom[10]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setRegionListTabel(
    [...new Set<string>(kolom[11]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setBrandListTabel(
    [...new Set<string>(kolom[12]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setOricodeListTabel(
    [...new Set<string>(kolom[13]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setUkuranListTabel(
    [...new Set<string>(kolom[14]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setProdDivListTabel(
    [...new Set<string>(kolom[17]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setProdGrpListTabel(
    [...new Set<string>(kolom[18]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setProdCatListTabel(
    [...new Set<string>(kolom[19]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setPeriodListTabel(
    [...new Set<string>(kolom[20]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setSeasonListTabel(
    [...new Set<string>(kolom[21]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
  setPromoListTabel(
    [...new Set<string>(kolom[23]["values"])].map((item: any) =>
      item !== null ? item : ""
    )
  );
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
      ppn:
        data[22]["values"][hitung] !== null
          ? data[22]["values"][hitung].toLocaleString("id-ID", {
              style: "percent",
              maximumFractionDigits: 2,
            })
          : "0.00%",
      promo: data[23]["values"][hitung],
      diskon:
        data[24]["values"][hitung] !== null
          ? data[24]["values"][hitung].toLocaleString("id-ID", {
              style: "percent",
              maximumFractionDigits: 2,
            })
          : "0.00%",
      kuantitas:
        data[25]["values"][hitung] !== null
          ? data[25]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      cost_price_per_unit:
        data[26]["values"][hitung] !== null
          ? data[26]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      retail_price_per_unit:
        data[27]["values"][hitung] !== null
          ? data[27]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      retail_price_per_unit_aft_disc:
        data[28]["values"][hitung] !== null
          ? data[28]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      retail_price_per_unit_aft_vat:
        data[29]["values"][hitung] !== null
          ? data[29]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      total_sales_at_retail:
        data[30]["values"][hitung] !== null
          ? data[30]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      total_sales_at_retail_aft_disc:
        data[31]["values"][hitung] !== null
          ? data[31]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      total_sales_at_retail_aft_vat:
        data[32]["values"][hitung] !== null
          ? data[32]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      total_sales_at_cost:
        data[33]["values"][hitung] !== null
          ? data[33]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      total_margin_aft_vat_rp:
        data[34]["values"][hitung] !== null
          ? data[34]["values"][hitung].toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })
          : "0",
      total_margin_aft_vat_persen:
        data[35]["values"][hitung] !== null
          ? data[35]["values"][hitung].toLocaleString("id-ID", {
              style: "percent",
              maximumFractionDigits: 2,
            })
          : "0.00%",
    });
  }
  dispatch(setDataPenjualan(arrDataPenjualan));
};

export const prosesInput = (
  dispatch: any,
  rangeTanggal: [Date | null, Date | null],
  setPenjualan: React.Dispatch<React.SetStateAction<PropsPenjualan>>,
  nilaiBrand: string[],
  nilaiDiv: string[],
  nilaiGroup: string[],
  nilaiCat: string[],
  nilaiSBU: string[],
  nilaiLokasi: string[],
  nilaiKlasifikasi: string[],
  nilaiRegion: string[],
  compPengguna: string[],
  indeksData: number,
  parameterBc: { [key: string]: any },
  setMuatDataPenjualan: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (rangeTanggal[0] === null || rangeTanggal[1] === null) {
    notifications.show({
      title: "Periode Tanggal Kosong",
      message: "Harap pilih periode tanggal penarikan data penjualan",
      autoClose: 3000,
      color: "red",
      icon: React.createElement(IconX, { size: "1.1rem" }),
      withCloseButton: false,
    });
    return;
  } else if (rangeTanggal[0].toISOString() > rangeTanggal[1].toISOString()) {
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
  setPenjualan({
    tglAwal: rangeTanggal[0],
    tglAkhir: rangeTanggal[1],
    brand: nilaiBrand,
    prodDiv: nilaiDiv,
    prodGrp: nilaiGroup,
    prodCat: nilaiCat,
    SBU:
      (compPengguna.length === 1 && compPengguna[0] === parameterBc.comp.pri) ||
      (compPengguna.length === 2 && indeksData === 0)
        ? nilaiSBU
        : [],
    lokasi:
      (compPengguna.length === 1 && compPengguna[0] === parameterBc.comp.pri) ||
      (compPengguna.length === 2 && indeksData === 0)
        ? nilaiLokasi
        : [],
    klasifikasi:
      (compPengguna.length === 1 && compPengguna[0] === parameterBc.comp.pnt) ||
      (compPengguna.length === 2 && indeksData === 1)
        ? nilaiKlasifikasi
        : [],
    region:
      (compPengguna.length === 1 && compPengguna[0] === parameterBc.comp.pnt) ||
      (compPengguna.length === 2 && indeksData === 1)
        ? nilaiRegion
        : [],
  });
  dispatch(setDrawerTerbuka(false));
  setMuatDataPenjualan(true);
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
