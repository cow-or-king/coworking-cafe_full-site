import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types pour le reporting
export type TurnoverData = {
  _id: string;
  date: string;
  HT: number;
  TTC: number;
  createdAt: string;
  updatedAt: string;
};

export type ReportingRange =
  | "week"
  | "previousWeek"
  | "customPreviousWeek"
  | "month"
  | "previousMonth"
  | "customPreviousMonth"
  | "yesterday"
  | "previousDay"
  | "customPreviousDay"
  | "year"
  | "previousYear"
  | "customPreviousYear";

export type ReportingParams = {
  range?: ReportingRange;
  startDate?: string;
  endDate?: string;
};

export type ReportingResponse = {
  success: boolean;
  data: {
    data: any;
    _id: string;
    HT: number;
    TTC: number;
  };
};

export const reportingApi = createApi({
  reducerPath: "reportingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Cache-Control", "no-cache");
      headers.set("Pragma", "no-cache");
      return headers;
    },
  }),
  tagTypes: ["Turnover", "Reporting"],
  endpoints: (builder) => ({
    // Récupérer les données de turnover
    getTurnover: builder.query<TurnoverData[], void>({
      query: () => "turnover",
      providesTags: ["Turnover"],
    }),

    // Récupérer les données de reporting avec paramètres (version simple pour test)
    getReportingSimple: builder.query<any, ReportingRange>({
      query: (range) => {
        console.log(`🚀 RTK Query query called for range:`, range);
        return `reporting?range=${range}`;
      },
      // Transforme la réponse pour extraire les données
      transformResponse: (response: any, meta, arg) => {
        console.log(`🔥 RTK Query transformResponse called:`, {
          response,
          meta,
          arg,
        });
        console.log(`🔥 RTK Query raw response:`, response);

        if (response && response.data) {
          console.log(`🔥 RTK Query extracted data:`, response.data);
          return response.data;
        }
        console.log(`🔥 RTK Query returning response as-is:`, response);
        return response;
      },
      providesTags: ["Reporting"],
      // Force la requête même si en cache
      forceRefetch: () => true,
    }),

    // Récupérer les données de reporting avec paramètres
    getReporting: builder.query<ReportingResponse["data"], ReportingParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.range) searchParams.set("range", params.range);
        if (params.startDate) searchParams.set("startDate", params.startDate);
        if (params.endDate) searchParams.set("endDate", params.endDate);

        return `reporting?${searchParams.toString()}`;
      },
      transformResponse: (response: ReportingResponse) => response.data,
      providesTags: ["Reporting"],
    }),

    // Créer une nouvelle entrée de turnover
    createTurnover: builder.mutation<
      { success: boolean; data: TurnoverData },
      Omit<TurnoverData, "_id" | "createdAt" | "updatedAt">
    >({
      query: (turnoverData) => ({
        url: "turnover",
        method: "POST",
        body: turnoverData,
      }),
      invalidatesTags: ["Turnover", "Reporting"],
    }),

    // Mettre à jour une entrée de turnover
    updateTurnover: builder.mutation<
      { success: boolean; data: TurnoverData },
      { id: string; data: Partial<TurnoverData> }
    >({
      query: ({ id, data }) => ({
        url: `turnover/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Turnover", "Reporting"],
    }),

    // Supprimer une entrée de turnover
    deleteTurnover: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `turnover/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Turnover", "Reporting"],
    }),
  }),
});

export const {
  useGetTurnoverQuery,
  useGetReportingQuery,
  useGetReportingSimpleQuery,
  useCreateTurnoverMutation,
  useUpdateTurnoverMutation,
  useDeleteTurnoverMutation,
} = reportingApi;
