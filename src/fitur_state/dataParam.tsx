import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface DataMultiSelect {
  label: string;
  value: string;
}

export interface dataParamState {
  parameterBc: {
    [key: string]: any;
  };
  parameterBrand: DataMultiSelect[][];
  parameterDiv: DataMultiSelect[][];
  parameterGroup: DataMultiSelect[][];
  parameterCat: DataMultiSelect[][];
  parameterSBU: DataMultiSelect[];
  parameterLokasi: DataMultiSelect[][];
  parameterKlasifikasi: DataMultiSelect[];
  parameterRegion: DataMultiSelect[];
  brandInput: string[][];
  divInput: string[][];
  grpInput: string[][];
  catInput: string[][];
  sbuInput: string[];
  lokasiInput: string[][];
  klasifikasiInput: string[];
  regionInput: string[];
  // ...
}

const initialState: dataParamState = {
  parameterBc: {},
  parameterBrand: [],
  parameterDiv: [],
  parameterGroup: [],
  parameterCat: [],
  parameterSBU: [],
  parameterLokasi: [],
  parameterKlasifikasi: [],
  parameterRegion: [],
  brandInput: [],
  divInput: [],
  grpInput: [],
  catInput: [],
  sbuInput: [],
  lokasiInput: [],
  klasifikasiInput: [],
  regionInput: [],
  // ...
};

const dataParamSlice = createSlice({
  name: "dataParam",
  initialState,
  reducers: {
    setParameterBc: (state, action: PayloadAction<{}>) => {
      state.parameterBc = action.payload;
    },
    setParameterBrand: (state, action: PayloadAction<DataMultiSelect[][]>) => {
      state.parameterBrand = action.payload;
    },
    setParameterDiv: (state, action: PayloadAction<DataMultiSelect[][]>) => {
      state.parameterDiv = action.payload;
    },
    setParameterGroup: (state, action: PayloadAction<DataMultiSelect[][]>) => {
      state.parameterGroup = action.payload;
    },
    setParameterCat: (state, action: PayloadAction<DataMultiSelect[][]>) => {
      state.parameterCat = action.payload;
    },
    setParameterSBU: (state, action: PayloadAction<DataMultiSelect[]>) => {
      state.parameterSBU = action.payload;
    },
    setParameterLokasi: (state, action: PayloadAction<DataMultiSelect[][]>) => {
      state.parameterLokasi = action.payload;
    },
    setParameterKlasifikasi: (
      state,
      action: PayloadAction<DataMultiSelect[]>
    ) => {
      state.parameterKlasifikasi = action.payload;
    },
    setParameterRegion: (state, action: PayloadAction<DataMultiSelect[]>) => {
      state.parameterRegion = action.payload;
    },
    setBrandInput: (state, action: PayloadAction<string[][]>) => {
      state.brandInput = action.payload;
    },
    setDivInput: (state, action: PayloadAction<string[][]>) => {
      state.divInput = action.payload;
    },
    setGrpInput: (state, action: PayloadAction<string[][]>) => {
      state.grpInput = action.payload;
    },
    setCatInput: (state, action: PayloadAction<string[][]>) => {
      state.catInput = action.payload;
    },
    setSBUInput: (state, action: PayloadAction<string[]>) => {
      state.sbuInput = action.payload;
    },
    setLokasiInput: (state, action: PayloadAction<string[][]>) => {
      state.lokasiInput = action.payload;
    },
    setKlasifikasiInput: (state, action: PayloadAction<string[]>) => {
      state.klasifikasiInput = action.payload;
    },
    setRegionInput: (state, action: PayloadAction<string[]>) => {
      state.regionInput = action.payload;
    },
    // ...
  },
});

export const {
  setParameterBc,
  setParameterBrand,
  setParameterDiv,
  setParameterGroup,
  setParameterCat,
  setParameterSBU,
  setParameterLokasi,
  setParameterKlasifikasi,
  setParameterRegion,
  setBrandInput,
  setDivInput,
  setGrpInput,
  setCatInput,
  setSBUInput,
  setLokasiInput,
  setKlasifikasiInput,
  setRegionInput,
  // ...
} = dataParamSlice.actions;

export const getParameterBc = (state: RootState) => state.dataParam.parameterBc;
export const getParameterBrand = (state: RootState) =>
  state.dataParam.parameterBrand;
export const getParameterDiv = (state: RootState) =>
  state.dataParam.parameterDiv;
export const getParameterGroup = (state: RootState) =>
  state.dataParam.parameterGroup;
export const getParameterCat = (state: RootState) =>
  state.dataParam.parameterCat;
export const getParameterSBU = (state: RootState) =>
  state.dataParam.parameterSBU;
export const getParameterLokasi = (state: RootState) =>
  state.dataParam.parameterLokasi;
export const getParameterKlasifikasi = (state: RootState) =>
  state.dataParam.parameterKlasifikasi;
export const getParameterRegion = (state: RootState) =>
  state.dataParam.parameterRegion;
export const getBrandInput = (state: RootState) => state.dataParam.brandInput;
export const getDivInput = (state: RootState) => state.dataParam.divInput;
export const getGrpInput = (state: RootState) => state.dataParam.grpInput;
export const getCatInput = (state: RootState) => state.dataParam.catInput;
export const getSBUInput = (state: RootState) => state.dataParam.sbuInput;
export const getLokasiInput = (state: RootState) => state.dataParam.lokasiInput;
export const getKlasifikasiInput = (state: RootState) =>
  state.dataParam.klasifikasiInput;
export const getRegionInput = (state: RootState) => state.dataParam.regionInput;

export default dataParamSlice;
