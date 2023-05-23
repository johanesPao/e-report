import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface DataMultiSelect {
  label: string;
  value: string;
}

export interface dataParamState {
  parameterBc: { [key: string]: { [key: string]: string } };
  parameterBrand: DataMultiSelect[][];
  parameterDiv: DataMultiSelect[][];
  parameterGroup: DataMultiSelect[][];
  parameterCat: DataMultiSelect[][];
  // ...
}

const initialState: dataParamState = {
  parameterBc: {},
  parameterBrand: [],
  parameterDiv: [],
  parameterGroup: [],
  parameterCat: [],
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
    // ...
  },
});

export const {
  setParameterBc,
  setParameterBrand,
  setParameterDiv,
  setParameterGroup,
  setParameterCat,
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

export default dataParamSlice;
