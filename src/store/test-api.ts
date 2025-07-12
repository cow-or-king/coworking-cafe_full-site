// API RTK Query simple pour test - CONFIGURATION MINIMALE
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    testReporting: builder.query<any, string>({
      query: (range) => {
        console.log(
          "🔥🔥🔥 TEST API: query() function EXECUTING with range:",
          range,
        );
        console.log(
          "🔥🔥🔥 TEST API: returning URL string:",
          `reporting?range=${range}`,
        );
        return `reporting?range=${range}`;
      },
      transformResponse: (response: any) => {
        console.log(
          "🔥🔥🔥 TEST API: transformResponse function EXECUTING:",
          response,
        );
        return response;
      },
    }),
  }),
});

export const { useTestReportingQuery } = testApi;
