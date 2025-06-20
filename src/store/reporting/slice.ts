import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReportingApi } from ".";
import { InitialReportingState } from "./state";

export const ReportingStore = createSlice({
  name: "reporting",
  reducerPath: "reporting",
  initialState: InitialReportingState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(ReportingApi.fetchData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(ReportingApi.fetchData.fulfilled, (state, action) => {
      state.loading = false;
      state.data[action.meta.arg] = action.payload;
    });
  },
});
