import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface DataMultiSelect {
  label: string;
  value: string;
}

export interface dataParamState {
  parameterBc: {};
  parameterBrand: DataMultiSelect[][];
  parameterDiv: DataMultiSelect[][];
  parameterGroup: DataMultiSelect[][];
  parameterCat: DataMultiSelect[][];
  parameterSBU: DataMultiSelect[];
  parameterLokasi: DataMultiSelect[];
  parameterKlasifikasi: DataMultiSelect[];
  parameterRegion: DataMultiSelect[];
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
    setParameterLokasi: (state, action: PayloadAction<DataMultiSelect[]>) => {
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

export default dataParamSlice;
