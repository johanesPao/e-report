import { PropsInput } from "../basic";

export interface PropsInputStok extends PropsInput {
  tglAkhir: Date | null;
  lokasi: string[];
}

export interface StateStok {
  stok: PropsInputStok;
  brandListTabel: string[];
  prodDivListTabel: string[];
  prodGrpListTabel: string[];
  prodCatListTabel: string[];
  lokasiListTabel: string[];
  muatDataStok: boolean;
}
