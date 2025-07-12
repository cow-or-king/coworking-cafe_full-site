// Hook de contournement RTK Query - fetch direct pour récupérer les données
console.log("🚀🚀🚀 FICHIER use-direct-reporting.ts CHARGÉ !!! 🚀🚀🚀");
import { useEffect, useState } from "react";

export type ReportingRange =
  | "yesterday"
  | "previousDay"
  | "week"
  | "previousWeek"
  | "month"
  | "previousMonth"
  | "year"
  | "previousYear"
  | "customPreviousDay"
  | "customPreviousWeek"
  | "customPreviousMonth"
  | "customPreviousYear";

export interface ReportingData {
  _id: string;
  TTC: number;
  HT: number;
}

interface DirectReportingState {
  data: ReportingData | null;
  isLoading: boolean;
  error: string | null;
}

export function useDirectReporting(range: ReportingRange) {
  console.log(`🚀🚀🚀 DIRECT HOOK CALLED FOR RANGE: ${range}`);

  const [state, setState] = useState<DirectReportingState>({
    data: null,
    isLoading: true,
    error: null,
  });

  console.log(`🚀 DIRECT HOOK STATE FOR ${range}:`, state);

  useEffect(() => {
    console.log(`🚀 DIRECT FETCH: useEffect triggered for range ${range}`);
    console.log(`🚀 DIRECT FETCH: Fetching data for range ${range}`);

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetch(`/api/reporting?range=${range}`)
      .then((response) => {
        console.log(
          `🚀 DIRECT FETCH: Response status for ${range}:`,
          response.status,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log(`🚀 DIRECT FETCH: Success for ${range}:`, responseData);

        // Vérifier la structure de la réponse
        if (responseData && responseData.success && responseData.data) {
          setState({
            data: responseData.data,
            isLoading: false,
            error: null,
          });
        } else {
          console.error(
            `🚀 DIRECT FETCH: Invalid response structure for ${range}:`,
            responseData,
          );
          setState({
            data: null,
            isLoading: false,
            error: "Invalid response structure",
          });
        }
      })
      .catch((error) => {
        console.error(`🚀 DIRECT FETCH: Error for ${range}:`, error);
        setState({
          data: null,
          isLoading: false,
          error: error.message,
        });
      });
  }, [range]);

  return state;
}

// Hook pour données multiples (similaire à useReportingData)
export function useDirectReportingData(
  range: ReportingRange,
  compareRange?: ReportingRange,
) {
  const mainData = useDirectReporting(range);
  const compareData = useDirectReporting(compareRange || "customPreviousDay");

  console.log(`📊 DIRECT REPORTING DATA [${range}]:`, {
    mainData: mainData.data,
    mainLoading: mainData.isLoading,
    mainError: mainData.error,
    compareData: compareData.data,
    compareLoading: compareData.isLoading,
    compareRange,
  });

  return {
    mainData: mainData.data,
    mainLoading: mainData.isLoading,
    mainError: mainData.error,
    compareData: compareData.data,
    compareLoading: compareData.isLoading,
    compareError: compareData.error,
    compareRange,
  };
}
