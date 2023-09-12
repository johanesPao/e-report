import { utils, writeFile } from "xlsx";

import {
  setDataKelayakanTokoBaru,
  setDataKetersediaanStok,
  setDataLabaRugiToko,
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
  setProsesAuth,
  setSesiAktif,
} from "../fitur_state/event";
import {
  setCompKueri,
  setCompPengguna,
  setDepartemenPengguna,
  setEmailPengguna,
  setIdPengguna,
  setNamaPengguna,
  setPeranPengguna,
} from "../fitur_state/pengguna";

export const toTitle = (kalimat: string) => {
  return kalimat.replace(/\w\S*/g, (teks) => {
    return teks.charAt(0).toUpperCase() + teks.substring(1).toLowerCase();
  });
};

export const resetAplikasi = (dispatch: any) => {
  dispatch(setSesiAktif(false));
  dispatch(setProsesAuth(false));
  dispatch(setIdPengguna(""));
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
  dispatch(setDataLabaRugiToko([]));
  dispatch(setDataKelayakanTokoBaru([]));
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

export interface ResponJSON {
  status: boolean;
}

export interface ResponJSONSemuaProposalTokoBaru extends ResponJSON {
  konten: DataKelayakanTokoBaru[];
}

export interface ResponJSONSemuaApprovalTokoBaru extends ResponJSON {
  konten: IApprovalTokoBaru[];
}

export interface ResponJSONKredensialApproverTokoBaru extends ResponJSON {
  konten: IKredensialApproverTokoBaru[];
}

export interface ResponJSONApprovalProposalID extends ResponJSON {
  approval_count?: number;
  konten?: IApprovalTokoBaru;
}

export enum ECompany {
  PRI = "PRI",
  PNT = "PNT",
}

export enum EDepartemenPengguna {
  ADMINISTRATOR = "all",
  FINANCE_ACCOUNTING = "fa",
  BUSINESS_DEVELOPMENT = "bizdev",
  MERCHANDISING = "merchandising",
}

export enum EPeranPengguna {
  ADMINISTRATOR = "superadmin",
  STAFF = "staff",
  MANAJER = "manajer",
}

export interface IIconColorMenu {
  icon: React.ReactNode;
  color: string;
}

export interface IMenuDirectLinks extends IIconColorMenu {
  label: ETampilanIndukMenuHalaman;
  links?: INavLinkMenu[];
  subMenu?: IMenuDirectLinks[];
}

export interface INavLinkMenu extends IIconColorMenu {
  label: ETampilanLinkHalaman;
  link: EHalaman;
}

export enum EHalaman {
  PENJUALAN = "penjualan",
  PENERIMAAN_BARANG = "penerimaanBarang",
  STOK = "stok",
  KETERSEDIAAN_STOK = "ketersediaanStok",
  BUYING_PROPOSAL = "buyingProposal",
  LABA_RUGI_TOKO = "labaRugiToko",
  KELAYAKAN_TOKO_BARU = "kelayakanTokoBaru",
}

export enum ETampilanLinkHalaman {
  PENJUALAN = "Penjualan",
  PENERIMAAN_BARANG = "Penerimaan Barang",
  STOK = "Stok",
  KETERSEDIAAN_STOK = "Ketersediaan Stok",
  BUYING_PROPOSAL = "Buying Proposal",
  LABA_RUGI_TOKO = "Laba & Rugi Toko",
  KELAYAKAN_TOKO_BARU = "Studi Kelayakan Toko Baru",
}

export enum ETampilanIndukMenuHalaman {
  DASHBOARD = "Dashboard",
  DATA = "Data",
  DEPARTEMEN = "Departemen",
  MERCHANDISING = "Merchandising",
  OPERATION = "Operation",
  FINANCE_ACCOUNTING = "Finance & Accounting",
  BUSINESS_DEVELOPMENT = "Business Development",
}

export interface IAksesMenu {
  penjualan: boolean;
  penerimaanBarang: boolean;
  stok: boolean;
  ketersediaanStok: boolean;
  buyingProposal: boolean;
  labaRugiToko: boolean;
  kelayakanTokoBaru: boolean;
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
  customer_name: string;
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
  total_bruto_aft_vat: number;
  obsolete: string;
};

export type DataPenerimaanBarang = {
  no_entry: number;
  post_date: string;
  no_dokumen_pr: string;
  no_dokumen_piv: string;
  no_dokumen_vendor: string;
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

export type DataInvoiceExtGRN = {
  no_dokumen_pr: string;
  no_dokumen_piv: string;
  no_dokumen_ext: string;
  oricode: string;
  ukuran: string;
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

export type DataLabaRugiToko = {
  coa: string;
  acc_name: string;
  [key: string]: string | number;
};

export type DataKelayakanTokoBaru = {
  proposal_id: string;
  versi: number;
  data: DataProposalTokoBaru;
};

type DataProposalTokoBaru = {
  input: InputProposalTokoBaru;
  output: OutputProposalTokoBaru;
  log_output: string[];
  remark: RemarkProposal;
  dibuat: Date;
  diedit: Date;
  pengguna: string;
  status: number;
};

type InputProposalTokoBaru = {
  nama_model: string;
  versi_model: string;
  sbu: string;
  kota_kabupaten: string;
  rentang_populasi: string;
  kelas_mall: string;
  luas_toko: number;
  prediksi_model: number;
  prediksi_user: number;
  margin_penjualan: number;
  ppn: number;
  tahun_umr: number;
  provinsi_umr: string;
  jumlah_staff: number;
  biaya_atk_utilitas: number;
  biaya_sewa: number;
  lama_sewa: number;
  biaya_fitout: number;
};

type OutputProposalTokoBaru = {
  user_generated: GeneratedProposalOutput;
  model_generated: GeneratedProposalOutput;
};

type GeneratedProposalOutput = {
  vat: number;
  net_sales: number;
  cogs: number;
  gross_profit: number;
  staff_expense: number;
  oau_expense: number;
  rental_expense: number;
  fitout_expense: number;
  store_income: number;
};

type RemarkProposal = {
  konten: string;
};

export type TDataTabelKelayakanTokoBaru = {
  proposal_id: string;
  versi: number;
  sbu: string;
  kota_kabupaten: string;
  kelas_mall: string;
  luas_toko: number;
  user_generated_store_income: number;
  model_generated_store_income: number;
  submit_by: string;
  dibuat: Date;
  diedit: Date;
  status: EStatusProposalTokoBaru;
  approval_status: IApproverKredensialTokoBaruStatus[];
};

export interface IApprovalTokoBaru {
  proposal_id: string;
  approval: IApproverTokoBaru[];
}

export interface IObjekIdApprover {
  id: IMongoObjectIdString;
}

export interface IApproverTokoBaru extends IObjekIdApprover {
  status: EStatusApprovalTokoBaru;
}

export interface IKredensialApproverTokoBaru extends IObjekIdApprover {
  nama: string;
  email: string;
}

export interface IApproverKredensialTokoBaruStatus extends IApproverTokoBaru {
  nama: string;
  email: string;
}

export interface IMongoObjectIdString {
  $oid: string;
}

export enum EStatusApprovalTokoBaru {
  "PENDING",
  "DITERIMA",
  "DITOLAK",
}

export interface Formulir {
  log: string[];
  proposal_id: string;
  versi_proposal: string;
  input: InputFormulir;
  output: {
    user_generated: OutputFormulir;
    model_generated: OutputFormulir;
  };
  remark: string;
}

interface InputFormulir {
  versi_model?: string;
  nama_model?: string;
  sbu?: string;
  kota_kabupaten?: string;
  rentang_populasi?: number;
  kelas_mall?: number;
  luas_toko?: number;
  margin_penjualan?: number;
  ppn?: number;
  tahun_umr?: string;
  provinsi_umr?: string;
  jumlah_staff?: number;
  biaya_oau?: number;
  biaya_sewa?: number;
  lama_sewa?: number;
  biaya_fitout?: number;
}

interface OutputFormulir {
  sales?: number;
  vat: number;
  net_sales: number;
  cogs: number;
  gross_profit: number;
  staff_expense: number;
  oau_expense: number;
  rental_expense: number;
  fitout_expense: number;
  store_income: number;
}

export interface IDisabilitasInputKelayakanTokoBaru {
  versi_proposal: boolean;
  sbu: boolean;
  kota_kabupaten: boolean;
  rentang_populasi: boolean;
  kelas_mall: boolean;
  luas_toko: boolean;
  prediksi_penjualan_user: boolean;
  margin_penjualan: boolean;
  ppn: boolean;
  tahun_umr: boolean;
  provinsi_umr: boolean;
  jumlah_staff: boolean;
  biaya_oau: boolean;
  biaya_sewa: boolean;
  lama_sewa: boolean;
  biaya_fitout: boolean;
  remark: boolean;
  tombol_satu: boolean;
  tombol_dua: boolean;
  tombol_tiga: boolean;
}

export interface IPopUpProps {
  togglePopUp: boolean;
  judulPopUp?: string;
  dataPopUp?: Record<string, any> | Record<string, any>[];
  modePopUp?: EModePopUpKelayakanTokoBaru;
  proposalID?: string;
}

export type TLabelValueInputItem = {
  label: string;
  value: string | number;
};

interface UMRItem {
  nama_data: string;
  tahun_data: number;
  data: TLabelValueInputItem[];
}

export interface IInputItemKelayakanTokoBaru {
  sbuItem: string[];
  rentangPopulasiItem: TLabelValueInputItem[];
  kelasMallItem: TLabelValueInputItem[];
  umrItem: UMRItem[];
  model: IModelKelayakanTokoBaru;
}

export interface IModelKelayakanTokoBaru {
  namaModelUrl: string;
  namaModel: string;
  versi: string;
  mean: string;
  std: string;
}

export interface IDataInputItemKelayakanTokoBaru {
  versiTerpilih: string[];
  sbuItem: string[];
  rentangPopulasi: TLabelValueInputItem[];
  kelasMall: {
    iconSemua: (nilai: number) => React.ReactNode;
    iconTerpilih: (nilai: number) => React.ReactNode;
  };
  tahunUMR: TLabelValueInputItem[];
  provinsiUMR: TLabelValueInputItem[][];
}

export interface IChatGPT {
  klien: IChatGPTClient;
  kueri: IKotaKabupatenKueriChatGPT;
}

export interface IChatGPTClient {
  endpoint_api: string;
  kunci_api: string;
  model_gpt: string;
  temperature: number;
  top_p: number;
  n: number;
}

export interface IKotaKabupatenKueriChatGPT {
  kota_eksis: IChatGPTKueri;
  populasi_kota_kabupaten: IChatGPTKueri;
  provinsi_kota_kabupaten: IChatGPTKueri;
}

export interface IChatGPTKueri {
  role: Record<string, any>[];
  prompt: Record<string, any>;
}

export interface IProposalToko {
  proposal_id: string;
  versi: number;
  data: IDataProposalToko;
}

interface IDataProposalToko {
  input: IInputProposalToko;
  output: IUserModelOutputProposalToko;
  log_output: string[];
  remark: IRemarkProposalToko;
  dibuat: string; //toISOString()
  diedit: string; //toISOString()
  pengguna: string;
  status: EStatusProposalTokoBaru;
}

interface IInputProposalToko {
  nama_model: string;
  versi_model: string;
  sbu: string;
  kota_kabupaten: string;
  rentang_populasi: string;
  kelas_mall: string;
  luas_toko: number;
  prediksi_model: number;
  prediksi_user: number;
  margin_penjualan: number;
  ppn: number;
  tahun_umr: number;
  provinsi_umr: string;
  jumlah_staff: number;
  biaya_atk_utilitas: number;
  biaya_sewa: number;
  lama_sewa: number;
  biaya_fitout: number;
}

interface IUserModelOutputProposalToko {
  user_generated: IOutputProposalToko;
  model_generated: IOutputProposalToko;
}

interface IOutputProposalToko {
  vat: number;
  net_sales: number;
  cogs: number;
  gross_profit: number;
  staff_expense: number;
  oau_expense: number;
  rental_expense: number;
  fitout_expense: number;
  store_income: number;
}

interface IRemarkProposalToko {
  konten: string;
}

export enum EPlaceholderTeks {
  "NAMA_KOTA_GPT" = "[nama_kota]",
  "LIST_PROVINSI_GPT" = "[list_provinsi]",
}

export enum EStatusProposalTokoBaru {
  "DRAFT" = 0,
  "SUBMIT",
  "DITOLAK",
  "DITERIMA",
}

export enum ETindakanProposalTokoBaru {
  "SIMPAN" = 0,
  "KIRIM",
  "DITOLAK",
  "DITERIMA",
}

export enum EModeTeksOutputNewStore {
  "INCOME" = "income",
  "EXPENSE" = "expense",
}

export enum EModePopUpKelayakanTokoBaru {
  "PENAMBAHAN" = "penambahan",
  "PERSETUJUAN" = "persetujuan",
  "SUNTING" = "sunting",
  "HAPUS" = "hapus",
}

export enum EKelasMallProposalToko {
  "Mall Kelas 1" = 1,
  "Mall Kelas 2",
  "Mall Kelas 3",
  "Mall Kelas 4/Non Mall",
}

export enum EKelasMallStringProposalToko {
  "Mall Kelas 1" = "Mall Kelas 1",
  "Mall Kelas 2" = "Mall Kelas 2",
  "Mall Kelas 3" = "Mall Kelas 3",
  "Mall Kelas 4/Non Mall" = "Mall Kelas 4/Non Mall",
}

export interface IAksenWarnaPopUp {
  header: string;
  mayor: string;
  minor: string;
  teksLoading: string;
  background: string;
  judul: IAksenWarnaJudul;
  disable: IAksenWarnaDisable;
  kelasMall: IAksenWarnaIconKelasMall;
  tombolBatal: IAksenWarnaTombol;
  tombolSimpan: IAksenWarnaTombol;
  tombolKirim: IAksenWarnaTombol;
}

interface IAksenWarnaJudul {
  teks: string;
}

interface IAksenWarnaDisable {
  mayor: string;
  mid: string;
  minor: string;
}

interface IAksenWarnaTombol {
  utama: string;
  hover: IAksenWarnaTombolHover;
}

interface IAksenWarnaTombolHover {
  background: string;
  teks: string;
}

interface IAksenWarnaIconKelasMall {
  kelasSatu: string;
  kelasDua: string;
  kelasTiga: string;
  kelasEmpat: string;
}

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
    case "labaRugiToko":
      file = "LabaRugiToko.xlsx";
      break;
    default:
      return;
  }
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Data");
  writeFile(workbook, file);
};
