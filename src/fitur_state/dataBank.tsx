import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";
import {
  DataKetersediaanStok,
  DataPenerimaanBarang,
  DataPenjualan,
  DataStok,
} from "../fungsi/basic";

export interface dataState {
  dataPenjualan: DataPenjualan[];
  dataPenerimaanBarang: DataPenerimaanBarang[];
  dataStok: DataStok[];
  dataKetersediaanStok: DataKetersediaanStok[];
  // ...
}

const initialState: dataState = {
  dataPenjualan: [],
  dataPenerimaanBarang: [],
  dataStok: [],
  dataKetersediaanStok: [],
  // ...
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setDataPenjualan: (state, action: PayloadAction<DataPenjualan[]>) => {
      state.dataPenjualan = action.payload;
    },
    setDataPenerimaanBarang: (
      state,
      action: PayloadAction<DataPenerimaanBarang[]>
    ) => {
      state.dataPenerimaanBarang = action.payload;
    },
    setDataStok: (state, action: PayloadAction<DataStok[]>) => {
      state.dataStok = action.payload;
    },
    setDataKetersediaanStok: (
      state,
      action: PayloadAction<DataKetersediaanStok[]>
    ) => {
      state.dataKetersediaanStok = action.payload;
    },
    // ...
  },
});

export const {
  setDataPenjualan,
  setDataPenerimaanBarang,
  setDataStok,
  setDataKetersediaanStok,
  // ...
} = dataSlice.actions;

export const getDataPenjualan = (state: RootState) => state.data.dataPenjualan;
export const getDataPenerimaanBarang = (state: RootState) =>
  state.data.dataPenerimaanBarang;
export const getDataStok = (state: RootState) => state.data.dataStok;
export const getDataKetersediaanStok = (state: RootState) =>
  state.data.dataKetersediaanStok;

export default dataSlice;
