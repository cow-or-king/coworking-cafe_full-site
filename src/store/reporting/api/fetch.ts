import { createTypedAsyncThunk } from "../../types";

export const fetchData = createTypedAsyncThunk(
  "reporting/fetchData",
  async function (range: "yesterday" | "week" | "month" | "year") {
    // If already loaded, do nothing.

    const res = await fetch(`/api/reporting?range=${range}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data.data;
  },
);
