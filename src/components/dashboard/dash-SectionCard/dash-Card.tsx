import { Card } from "@/components/ui/card";
import { ReportingApi } from "@/store/reporting";
import { useTypedDispatch, useTypedSelector } from "@/store/types";
import { ReactNode, useEffect } from "react";
import { DashCardFooter } from "./dash-CardFooter";
import { DashCardHeader } from "./dash-CardHeader";

interface DashCardProps {
  description_header: string;
  trendin_header: ReactNode;
  // description_footer: string;
  trendin_footer: ReactNode;
  text_trendin: string;
  range: "yesterday" | "week" | "month" | "year";
  secRange: "previousDay" | "previousWeek" | "previousMonth" | "previousYear"; // Optional for future use.
  compare:
    | "customPreviousDay"
    | "customPreviousWeek"
    | "customPreviousMonth"
    | "customPreviousYear"; // Default comparison range.
  checked: boolean;
  valueChartData: {
    HT: number;
    TTC: number;
  }; // Optional, can be used for future enhancements.
}

export function DashCard({
  description_header,
  text_trendin,
  range,
  secRange,
  checked,
  compare,
}: DashCardProps) {
  // Load the appropriate data from the store.
  const dispatch = useTypedDispatch();
  useEffect(() => {
    dispatch(ReportingApi.fetchData(range)).then(console.log);
  }, [dispatch, range]);
  useEffect(() => {
    dispatch(ReportingApi.fetchData2(secRange)).then(console.log);
  }, [dispatch, secRange]);
  useEffect(() => {
    dispatch(ReportingApi.fetchData3(compare)).then(console.log);
  }, [dispatch, compare]);

  const chartData = useTypedSelector((state) => state.reporting.data[range]);
  const chartData2 = useTypedSelector(
    (state) =>
      state.reporting.data?.[secRange as keyof typeof state.reporting.data],
  );
  const chartData3 = useTypedSelector(
    (state) =>
      state.reporting.data?.[compare as keyof typeof state.reporting.data],
  );

  const AmountFormatter = new Intl.NumberFormat("fr", {
    style: "currency",
    currency: "eur",
  });

  return (
    <Card className="@container/card">
      <DashCardHeader
        description_header={description_header}
        value_TTC={chartData?.TTC ?? 0}
        value_HT={chartData?.HT ?? 0}
        checked={checked}
        compareTTC={chartData3?.TTC ?? 0}
        compareHT={chartData3?.HT ?? 0}
      />
      <DashCardFooter
        text_trendin={
          checked
            ? `${secRange === "previousDay" ? "Tendance de la journée" : secRange === "previousWeek" ? "Tendance de la semaine" : secRange === "previousMonth" ? "Tendance du mois" : "Tendance de l'année"} `
            : `${secRange === "previousDay" ? "Tendance de la journée" : secRange === "previousWeek" ? "Tendance de la semaine" : secRange === "previousMonth" ? "Tendance du mois" : "Tendance de l'année"} `
        }
        valueChartData={chartData2 ?? { HT: 0, TTC: 0 }}
        checked={checked}
        percentageChangeHT={
          chartData3?.HT
            ? ((chartData?.HT ?? 0 - chartData3.HT) / chartData3.HT) * 100
            : 0
        }
        percentageChangeTTC={
          chartData3?.TTC
            ? ((chartData?.TTC ?? 0 - chartData3.TTC) / chartData3.TTC) * 100
            : 0
        }
        description_footer={
          checked
            ? `Comparé ${secRange === "previousDay" ? "à la même journée de la semaine précèdente" : secRange === "previousWeek" ? "à la semaine précédente" : secRange === "previousMonth" ? "au mois précédent" : "à l'année précédente"}  ${AmountFormatter.format(chartData2?.TTC ?? 0)} `
            : `Comparé ${secRange === "previousDay" ? "à la même journée de la semaine précèdente" : secRange === "previousWeek" ? "à la semaine précédente" : secRange === "previousMonth" ? "au mois précédent" : "à l'année précédente"} ${AmountFormatter.format(chartData2?.HT ?? 0)} ` // This is the description for the footer.
        }
        value={chartData3?.HT ?? 0}
      />
    </Card>
  );
}
