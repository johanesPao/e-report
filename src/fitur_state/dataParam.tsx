import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface dataParamState {
  parameterBC: {
    kolom_bc: {
      brand_dim: string;
      oricode: string;
    };
    tabel_bc: {
      jurnal_item_437: string;
    };
    argumen_bc: {
      item_service_prefix: string;
    };
  };
  // ...
}

const initialState: dataParamState = {
  parameterBC: {
    kolom_bc: {
      brand_dim: "",
      oricode: "",
    },
    tabel_bc: {
      jurnal_item_437: "",
    },
    argumen_bc: {
      item_service_prefix: "",
    },
  },
  // ...
};

const dataParamSlice = createSlice({
  name: "dataParam",
  initialState,
  reducers: {
    setParameterBC: (
      state,
      action: PayloadAction<dataParamState["parameterBC"]>
    ) => {
      state.parameterBC = action.payload;
    },
    resetParameterBC: (state) => {
      state.parameterBC = initialState.parameterBC;
    },
    // ...
  },
});

export const {
  setParameterBC,
  resetParameterBC,
  // ...
} = dataParamSlice.actions;

export const getParameterBC = (state: RootState) => state.dataParam.parameterBC;

export default dataParamSlice;
