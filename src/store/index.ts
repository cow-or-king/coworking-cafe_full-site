import { configureStore } from "@reduxjs/toolkit";
import { CashEntryStore } from "./cashentry";
import { emergencyApi } from "./emergency-api";
import { reportingApi } from "./reporting/api";
import { shiftApi } from "./shift/api";
import staffReducer from "./staff/slice";
import { testApi } from "./test-api";
import { TurnoverStore } from "./turnover";

export const store = configureStore({
  reducer: {
    [TurnoverStore.reducerPath]: TurnoverStore.reducer,
    [CashEntryStore.name]: CashEntryStore.reducer,
    [shiftApi.reducerPath]: shiftApi.reducer,
    [reportingApi.reducerPath]: reportingApi.reducer,
    [testApi.reducerPath]: testApi.reducer,
    [emergencyApi.reducerPath]: emergencyApi.reducer,

    staff: staffReducer, // Ajout du slice staff
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware()
      .concat(shiftApi.middleware)
      .concat(reportingApi.middleware)
      .concat(testApi.middleware)
      .concat(emergencyApi.middleware);
  },
  enhancers(getDefaultEnhancers) {
    return getDefaultEnhancers();
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
