import { PropsInput } from "../basic";

export interface PropsInputKetersediaanStok extends PropsInput {
  lokasi: string[];
}

export interface StateKetersediaanStok {
  ketersediaanStok: PropsInputKetersediaanStok;
  brandListTabel: string[];
  prodDivListTabel: string[];
  prodGrpListTabel: string[];
  prodCatListTabel: string[];
  lokasiListTabel: string[];
  muatKetersediaanStok: boolean;
}
