import { configureStore } from '@reduxjs/toolkit';
import { TurnoverStore } from './turnover';

export const store = configureStore({
  reducer: {
    [TurnoverStore.reducerPath]: TurnoverStore.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({});
  },
  enhancers(getDefaultEnhancers) {
    return getDefaultEnhancers();
  },
  devTools: true,
});
