import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface PenggunaState {
  idPengguna: string;
  namaPengguna: string;
  emailPengguna: string;
  departemenPengguna: string;
  peranPengguna: string;
  compPengguna: string[];
  compKueri: string;
  // ...
}

const initialState: PenggunaState = {
  idPengguna: "",
  namaPengguna: "",
  emailPengguna: "",
  departemenPengguna: "",
  peranPengguna: "",
  compPengguna: [],
  compKueri: "",

  // ...
};

const penggunaSlice = createSlice({
  name: "pengguna",
  initialState,
  reducers: {
    setIdPengguna: (state, action: PayloadAction<string>) => {
      state.idPengguna = action.payload;
    },
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
    setCompPengguna: (state, action: PayloadAction<string[]>) => {
      state.compPengguna = action.payload;
    },
    setCompKueri: (state, action: PayloadAction<string>) => {
      state.compKueri = action.payload;
    },
  },
});

export const {
  setIdPengguna,
  setNamaPengguna,
  setEmailPengguna,
  setDepartemenPengguna,
  setPeranPengguna,
  setCompPengguna,
  setCompKueri,
  // ...
} = penggunaSlice.actions;

export const getIdPengguna = (state: RootState) => state.pengguna.idPengguna;
export const getNamaPengguna = (state: RootState) =>
  state.pengguna.namaPengguna;
export const getEmailPengguna = (state: RootState) =>
  state.pengguna.emailPengguna;
export const getDepartemenPengguna = (state: RootState) =>
  state.pengguna.departemenPengguna;
export const getPeranPengguna = (state: RootState) =>
  state.pengguna.peranPengguna;
export const getCompPengguna = (state: RootState) =>
  state.pengguna.compPengguna;
export const getCompKueri = (state: RootState) => state.pengguna.compKueri;

export default penggunaSlice;
