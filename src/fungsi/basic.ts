import {
  setParameterBc,
  setParameterBrand,
  setParameterCat,
  setParameterDiv,
  setParameterGroup,
  setParameterKlasifikasi,
  setParameterLokasi,
  setParameterRegion,
  setParameterSBU,
} from "../fitur_state/dataParam";
import {
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
  no_entry: string;
  post_date: Date;
  system_created_at: Date;
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
  ppn: number;
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
