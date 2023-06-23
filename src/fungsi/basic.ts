import { utils, writeFile } from "xlsx";

import {
  setDataKetersediaanStok,
  setDataPenerimaanBarang,
  setDataPenjualan,
  setDataStok,
} from "../fitur_state/dataBank";
import {
  setBrandInput,
  setCatInput,
  setDivInput,
  setGrpInput,
  setKlasifikasiInput,
  setLokasiInput,
  setParameterBc,
  setParameterBrand,
  setParameterCat,
  setParameterDiv,
  setParameterGroup,
  setParameterKlasifikasi,
  setParameterLokasi,
  setParameterRegion,
  setParameterSBU,
  setRegionInput,
  setSBUInput,
} from "../fitur_state/dataParam";
import {
  setDrawerTerbuka,
  setHalaman,
  setIndeksData,
  setKonekKeBC,
  setSesiAktif,
} from "../fitur_state/event";
import {
  setCompKueri,
  setCompPengguna,
  setDepartemenPengguna,
  setEmailPengguna,
  setNamaPengguna,
  setPeranPengguna,
} from "../fitur_state/pengguna";

export const toTitle = (kalimat: string) => {
  return kalimat
    .toLowerCase()
    .split(" ")
    .map((kata) => {
      return kata.replace(kata[0], kata[0].toUpperCase());
    })
    .join(" ");
};

export const resetAplikasi = (dispatch: any) => {
  dispatch(setSesiAktif(false));
  dispatch(setNamaPengguna(""));
  dispatch(setEmailPengguna(""));
  dispatch(setDepartemenPengguna(""));
  dispatch(setPeranPengguna(""));
  dispatch(setKonekKeBC(false));
  dispatch(setHalaman("dashboard"));
  dispatch(setCompPengguna([]));
  dispatch(setCompKueri(""));
  dispatch(setParameterBc({}));
  dispatch(setParameterBrand([]));
  dispatch(setIndeksData(0));
  dispatch(setParameterDiv([]));
  dispatch(setParameterGroup([]));
  dispatch(setParameterCat([]));
  dispatch(setParameterSBU([]));
  dispatch(setParameterLokasi([]));
  dispatch(setParameterKlasifikasi([]));
  dispatch(setParameterRegion([]));
  dispatch(setDrawerTerbuka(false));
  dispatch(setBrandInput([]));
  dispatch(setDivInput([]));
  dispatch(setGrpInput([]));
  dispatch(setCatInput([]));
  dispatch(setSBUInput([]));
  dispatch(setLokasiInput([]));
  dispatch(setKlasifikasiInput([]));
  dispatch(setRegionInput([]));
  dispatch(setDataPenjualan([]));
  dispatch(setDataPenerimaanBarang([]));
  dispatch(setDataStok([]));
  dispatch(setDataKetersediaanStok([]));
};

export interface Dimensi {
  sbu: string;
  dimensi: string[];
}

export const dimensiECommerce = (parameterBc: { [key: string]: any }) => {
  const dimensi: Dimensi = {
    sbu: parameterBc.peta_dimensi_sbu.ecommerce.sbu,
    dimensi: parameterBc.peta_dimensi_sbu.ecommerce.dimensi,
  };
  return dimensi;
};

export const dimensiFisikSport = (parameterBc: { [key: string]: any }) => {
  const dimensi: Dimensi = {
    sbu: parameterBc.peta_dimensi_sbu.fisik_sport.sbu,
    dimensi: parameterBc.peta_dimensi_sbu.fisik_sport.dimensi,
  };
  return dimensi;
};

export const dimensiFisikFootball = (parameterBc: { [key: string]: any }) => {
  const dimensi: Dimensi = {
    sbu: parameterBc.peta_dimensi_sbu.fisik_football.sbu,
    dimensi: parameterBc.peta_dimensi_sbu.fisik_football.dimensi,
  };
  return dimensi;
};

export const dimensiOurDailyDose = (parameterBc: { [key: string]: any }) => {
  const dimensi: Dimensi = {
    sbu: parameterBc.peta_dimensi_sbu.our_daily_dose.sbu,
    dimensi: parameterBc.peta_dimensi_sbu.our_daily_dose.dimensi,
  };
  return dimensi;
};

export const dimensiWholesale = (parameterBc: { [key: string]: any }) => {
  const dimensi: Dimensi = {
    sbu: parameterBc.peta_dimensi_sbu.wholesale.sbu,
    dimensi: parameterBc.peta_dimensi_sbu.wholesale.dimensi,
  };
  return dimensi;
};

export const dimensiBazaarOthers = (parameterBc: { [key: string]: any }) => {
  const dimensi: Dimensi = {
    sbu: parameterBc.peta_dimensi_sbu.bazaar_others.sbu,
    dimensi: parameterBc.peta_dimensi_sbu.bazaar_others.dimensi,
  };
  return dimensi;
};

export interface PropsInput {
  brand: string[];
  prodDiv: string[];
  prodGrp: string[];
  prodCat: string[];
}

export interface StateInputDrawer {
  nilaiBrand: string[];
  nilaiDiv: string[];
  nilaiGrp: string[];
  nilaiCat: string[];
}

export interface Filter {
  brand: string[];
  prod_div: string[];
  prod_grp: string[];
  prod_cat: string[];
  sbu?: string[];
  lokasi?: string[];
  klasifikasi?: string[];
  region?: string[];
}

export type DataPenjualan = {
  no_entry: number;
  post_date: string;
  system_created_at: string;
  sbu: string;
  loc_code: string;
  toko: string;
  no_dokumen: string;
  no_dokumen_oth: string;
  source_no: string;
  classification: string;
  salesperson: string;
  region: string;
  brand_dim: string;
  oricode: string;
  ukuran: string;
  deskripsi_produk: string;
  warna: string;
  prod_div: string;
  prod_grp: string;
  prod_cat: string;
  period: string;
  season: string;
  ppn: string;
  promo: string;
  diskon: number;
  kuantitas: number;
  cost_price_per_unit: number;
  retail_price_per_unit: number;
  retail_price_per_unit_aft_disc: number;
  retail_price_per_unit_aft_vat: number;
  total_sales_at_retail: number;
  total_sales_at_retail_aft_disc: number;
  total_sales_at_retail_aft_vat: number;
  total_sales_at_cost: number;
  total_margin_aft_vat_rp: number;
  total_margin_aft_vat_persen: number;
};

export type DataPenerimaanBarang = {
  no_entry: number;
  post_date: string;
  no_dokumen_pr: string;
  no_dokumen_wr: string;
  no_dokumen_po: string;
  loc_code: string;
  brand_dim: string;
  oricode: string;
  deskripsi_produk: string;
  warna: string;
  ukuran: string;
  prod_div: string;
  prod_grp: string;
  prod_cat: string;
  retail_price_per_unit: number;
  goods_received_quantity: number;
  goods_received_cost: number;
};

export type DataStok = {
  loc_code: string;
  brand_dim: string;
  oricode: string;
  deskripsi_produk: string;
  warna: string;
  ukuran: string;
  season: string;
  period: string;
  prod_div: string;
  prod_grp: string;
  prod_cat: string;
  retail_price_per_unit: number;
  stock_quantity: number;
  stock_cost: number;
};

export type DataKetersediaanStok = {
  loc_code: string;
  brand_dim: string;
  oricode: string;
  ukuran: string;
  season: string;
  period: string;
  deskripsi_produk: string;
  warna: string;
  prod_div: string;
  prod_grp: string;
  prod_cat: string;
  item_disc_group: string;
  retail_price_per_unit: number;
  stock_on_hand: number;
  total_cost: number;
  po_outstanding_qty: number;
  so_outstanding_qty: number;
  proj_stock_intake: number;
  proj_stock_aft_so: number;
};

export const unduhTabelKeExcel = (data: any[], halaman: string) => {
  let file: string;
  switch (halaman) {
    case "penjualan":
      file = "DataPenjualan.xlsx";
      break;
    case "penerimaanBarang":
      file = "DataPenerimaanBarang.xlsx";
      break;
    case "stok":
      file = "DataStok.xlsx";
      break;
    case "ketersediaanStok":
      file = "DataKetersediaanStok.xlsx";
      break;
    default:
      return;
  }
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Data");
  writeFile(workbook, file);
};
