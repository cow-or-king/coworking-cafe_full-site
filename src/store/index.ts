import { configureStore } from "@reduxjs/toolkit";
import { CashEntryStore } from "./cashentry";
import { ReportingStore } from "./reporting";
import staffReducer from "./staff/slice";
import { TurnoverStore } from "./turnover";

export const store = configureStore({
  reducer: {
    [TurnoverStore.reducerPath]: TurnoverStore.reducer,
    [ReportingStore.reducerPath]: ReportingStore.reducer,
    [CashEntryStore.name]: CashEntryStore.reducer,

    staff: staffReducer, // Ajout du slice staff
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({});
  },
  enhancers(getDefaultEnhancers) {
    return getDefaultEnhancers();
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
