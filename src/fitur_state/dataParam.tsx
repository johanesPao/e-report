import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface dataParamState {
  parameterBc: { [key: string]: { [key: string]: string } };
  parameterBrand: string[];
  // ...
}

const initialState: dataParamState = {
  parameterBc: {},
  parameterBrand: [],
  // ...
};

const dataParamSlice = createSlice({
  name: "dataParam",
  initialState,
  reducers: {
    setParameterBc: (state, action: PayloadAction<{}>) => {
      state.parameterBc = action.payload;
    },
    setParameterBrand: (state, action: PayloadAction<string[]>) => {
      state.parameterBrand = action.payload;
    },
    // ...
  },
});

export const {
  setParameterBc,
  setParameterBrand,
  // ...
} = dataParamSlice.actions;

export const getParameterBc = (state: RootState) => state.dataParam.parameterBc;
export const getParameterBrand = (state: RootState) =>
  state.dataParam.parameterBrand;

export default dataParamSlice;
