import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import Slice
import eventSlice from "../fitur_state/event";
import penggunaSlice from "../fitur_state/pengguna";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["event", "pengguna"],
};

const rootReducer = combineReducers({
  event: eventSlice.reducer,
  pengguna: penggunaSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
