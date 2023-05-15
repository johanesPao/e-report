import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface PenggunaState {
  namaPengguna: string;
  emailPengguna: string;
  departemenPengguna: string;
  peranPengguna: string;
  // ...
}

const initialState: PenggunaState = {
  namaPengguna: "",
  emailPengguna: "",
  departemenPengguna: "",
  peranPengguna: "",
  // ...
};

const penggunaSlice = createSlice({
  name: "pengguna",
  initialState,
  reducers: {
    setNamaPengguna: (state, action: PayloadAction<string>) => {
      state.namaPengguna = action.payload;
    },
    setEmailPengguna: (state, action: PayloadAction<string>) => {
      state.emailPengguna = action.payload;
    },
    setDepartemenPengguna: (state, action: PayloadAction<string>) => {
      state.departemenPengguna = action.payload;
    },
    setPeranPengguna: (state, action: PayloadAction<string>) => {
      state.peranPengguna = action.payload;
    },
  },
});

export const {
  setNamaPengguna,
  setEmailPengguna,
  setDepartemenPengguna,
  setPeranPengguna,
  // ...
} = penggunaSlice.actions;

export const getNamaPengguna = (state: RootState) =>
  state.pengguna.namaPengguna;
export const getEmailPengguna = (state: RootState) =>
  state.pengguna.emailPengguna;
export const getDepartemenPengguna = (state: RootState) =>
  state.pengguna.departemenPengguna;
export const getPeranPengguna = (state: RootState) =>
  state.pengguna.peranPengguna;

export default penggunaSlice;
