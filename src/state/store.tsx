import { configureStore } from "@reduxjs/toolkit";

// Import Slice
import eventSlice from "../fitur_state/event";
import penggunaSlice from "../fitur_state/pengguna";

// Buat Store dan Isi Slice
export const store = configureStore({
  reducer: {
    event: eventSlice.reducer,
    pengguna: penggunaSlice.reducer,
  },
});

// Export Types Helper
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
