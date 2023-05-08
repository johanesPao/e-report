import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface PenggunaState {
  namaPengguna: string;
  // ...
}

const initialState: PenggunaState = {
  namaPengguna: "",
  // ...
};

const penggunaSlice = createSlice({
  name: "pengguna",
  initialState,
  reducers: {
    setNamaPengguna: (state, action: PayloadAction<string>) => {
      state.namaPengguna = action.payload;
    },
    // ...
  },
});

export const {
  setNamaPengguna,
  // ...
} = penggunaSlice.actions;

export const getNamaPengguna = (state: RootState) =>
  state.pengguna.namaPengguna;

export default penggunaSlice;
