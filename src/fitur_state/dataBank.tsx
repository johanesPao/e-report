import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";
import { DataPenjualan } from "../fungsi/basic";

export interface dataState {
  dataPenjualan: DataPenjualan[];
  // ...
}

const initialState: dataState = {
  dataPenjualan: [],
  // ...
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setDataPenjualan: (state, action: PayloadAction<DataPenjualan[]>) => {
      state.dataPenjualan = action.payload;
    },
    // ...
  },
});

export const {
  setDataPenjualan,
  // ...
} = dataSlice.actions;

export const getDataPenjualan = (state: RootState) => state.data.dataPenjualan;

export default dataSlice;
