import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface EventState {
  skemaWarna: string;
  prosesAuth: boolean;
  authGagal: boolean;
  sesiAktif: boolean;
  drawerTerbuka: boolean;
  halaman: string;
  konekKeBC: boolean;
  indeksData: number;
  // ...
}

const initialState: EventState = {
  skemaWarna: "dark",
  prosesAuth: false,
  authGagal: false,
  sesiAktif: false,
  drawerTerbuka: false,
  halaman: "dashboard",
  konekKeBC: false,
  indeksData: 0,
  // ...
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setSkemaWarna: (state, action: PayloadAction<string>) => {
      state.skemaWarna = action.payload;
    },
    setProsesAuth: (state, action: PayloadAction<boolean>) => {
      state.prosesAuth = action.payload;
    },
    setAuthGagal: (state, action: PayloadAction<boolean>) => {
      state.authGagal = action.payload;
    },
    setSesiAktif: (state, action: PayloadAction<boolean>) => {
      state.sesiAktif = action.payload;
    },
    setDrawerTerbuka: (state, action: PayloadAction<boolean>) => {
      state.drawerTerbuka = action.payload;
    },
    setHalaman: (state, action: PayloadAction<string>) => {
      state.halaman = action.payload;
    },
    setKonekKeBC: (state, action: PayloadAction<boolean>) => {
      state.konekKeBC = action.payload;
    },
    setIndeksData: (state, action: PayloadAction<number>) => {
      state.indeksData = action.payload;
    },
    // ...
  },
});

export const {
  setSkemaWarna,
  setProsesAuth,
  setAuthGagal,
  setSesiAktif,
  setDrawerTerbuka,
  setHalaman,
  setKonekKeBC,
  setIndeksData,
  // ...
} = eventSlice.actions;

export const getSkemaWarna = (state: RootState) => state.event.skemaWarna;
export const getProsesAuth = (state: RootState) => state.event.prosesAuth;
export const getAuthGagal = (state: RootState) => state.event.authGagal;
export const getSesiAktif = (state: RootState) => state.event.sesiAktif;
export const getDrawerTerbuka = (state: RootState) => state.event.drawerTerbuka;
export const getHalaman = (state: RootState) => state.event.halaman;
export const getKonekKeBC = (state: RootState) => state.event.konekKeBC;
export const getIndeksData = (state: RootState) => state.event.indeksData;

export default eventSlice;
