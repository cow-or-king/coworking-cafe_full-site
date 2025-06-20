import { configureStore } from "@reduxjs/toolkit";
import { TurnoverStore } from "./turnover";
import { ReportingStore } from "./reporting";

export const store = configureStore({
  reducer: {
    [TurnoverStore.reducerPath]: TurnoverStore.reducer,
    [ReportingStore.reducerPath]: ReportingStore.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({});
  },
  enhancers(getDefaultEnhancers) {
    return getDefaultEnhancers();
  },
  devTools: true,
});
