// API RTK Query EMERGENCY - Configuration complètement nouvelle
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

console.log("🚨🚨🚨 EMERGENCY API LOADED !!!");

export const emergencyApi = createApi({
  reducerPath: "emergencyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    emergencyTest: builder.query<any, void>({
      query: () => {
        console.log("🚨🚨🚨 EMERGENCY API: query() function CALLED !!!");
        return "reporting?range=yesterday";
      },
      transformResponse: (response: any) => {
        console.log(
          "🚨🚨🚨 EMERGENCY API: transformResponse CALLED !!!",
          response,
        );
        return response;
      },
    }),
  }),
});

export const { useEmergencyTestQuery } = emergencyApi;
