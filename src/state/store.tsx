import { persistReducer, persistStore } from "redux-persist";
import localforage from "localforage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import Slice
import eventSlice from "../fitur_state/event";
import penggunaSlice from "../fitur_state/pengguna";
import dataParamSlice from "../fitur_state/dataParam";
import dataSlice from "../fitur_state/dataBank";

const persistConfig = {
  key: "root",
  storage: localforage,
  whitelist: ["event", "pengguna", "dataParam", "data"],
};

const rootReducer = combineReducers({
  event: eventSlice.reducer,
  pengguna: penggunaSlice.reducer,
  dataParam: dataParamSlice.reducer,
  data: dataSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
