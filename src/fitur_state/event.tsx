import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface EventState {
  skemaWarna: string;
  prosesAuth: boolean;
  authGagal: boolean;
  sesiAktif: boolean;
  sidebarAktif: boolean;
  halaman: string;
  // ...
}

const initialState: EventState = {
  skemaWarna: "dark",
  prosesAuth: false,
  authGagal: false,
  sesiAktif: false,
  sidebarAktif: false,
  halaman: "dashboard",
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
    setSidebarAktif: (state, action: PayloadAction<boolean>) => {
      state.sidebarAktif = action.payload;
    },
    setHalaman: (state, action: PayloadAction<string>) => {
      state.halaman = action.payload;
    },
    // ...
  },
});

export const {
  setSkemaWarna,
  setProsesAuth,
  setAuthGagal,
  setSesiAktif,
  setSidebarAktif,
  setHalaman,
  // ...
} = eventSlice.actions;

export const getSkemaWarna = (state: RootState) => state.event.skemaWarna;
export const getProsesAuth = (state: RootState) => state.event.prosesAuth;
export const getAuthGagal = (state: RootState) => state.event.authGagal;
export const getSesiAktif = (state: RootState) => state.event.sesiAktif;
export const getSidebarAktif = (state: RootState) => state.event.sidebarAktif;
export const getHalaman = (state: RootState) => state.event.halaman;

export default eventSlice;
