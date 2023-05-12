import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface PenggunaState {
  namaPengguna: string;
  emailPengguna: string;
  // ...
}

const initialState: PenggunaState = {
  namaPengguna: "",
  emailPengguna: "",
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
  },
});

export const {
  setNamaPengguna,
  setEmailPengguna,
  // ...
} = penggunaSlice.actions;

export const getNamaPengguna = (state: RootState) =>
  state.pengguna.namaPengguna;
export const getEmailPengguna = (state: RootState) =>
  state.pengguna.emailPengguna;

export default penggunaSlice;
