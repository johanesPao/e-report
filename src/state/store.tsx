import { persistReducer, persistStore } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import Slice
import eventSlice from "../fitur_state/event";
import penggunaSlice from "../fitur_state/pengguna";
import dataParamSlice from "../fitur_state/dataParam";
import dataSlice from "../fitur_state/dataBank";
// import localStorage from "redux-persist/es/storage";
import localForage from "localforage";

const persistConfig = {
  key: "root",
  storage: localForage,
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
