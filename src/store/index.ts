import { configureStore } from "@reduxjs/toolkit";
import { TurnoverStore } from "./turnover";
import { ReportingStore } from "./reporting";
import { CashEntryStore } from "./cashentry";

export const store = configureStore({
  reducer: {
    [TurnoverStore.reducerPath]: TurnoverStore.reducer,
    [ReportingStore.reducerPath]: ReportingStore.reducer,
    [CashEntryStore.name]: CashEntryStore.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({});
  },
  enhancers(getDefaultEnhancers) {
    return getDefaultEnhancers();
  },
  devTools: true,
});
