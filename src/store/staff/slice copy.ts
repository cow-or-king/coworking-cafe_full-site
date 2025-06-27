import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Thunk pour envoyer les données du formulaire à l'API
export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async (
    staffData: { firstName: string; lastName: string; email: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("/api/staff/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue");
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Slice Redux pour staff
const staffSlice = createSlice({
  name: "staff",
  initialState: {
    loading: false,
    error: null as string | null, // Correction du type
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createStaff.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export default staffSlice.reducer;
