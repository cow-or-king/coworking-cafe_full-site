import { Card } from "@/components/ui/card";
import { ReportingApi } from "@/store/reporting";
import { useTypedDispatch, useTypedSelector } from "@/store/types";
import { ReactNode, useEffect } from "react";
import { DashCardFooter } from "./dash-CardFooter";
import { DashCardHeader } from "./dash-CardHeader";

interface DashCardProps {
  description_header: string;
  trendin_header: ReactNode;
  value: number | string;
  description_footer: string;
  trendin_footer: ReactNode;
  text_trendin: string;
  range: "yesterday" | "week" | "month" | "year";
  checked: boolean;
}

export function DashCard({
  description_header,
  description_footer,
  trendin_header,
  trendin_footer,
  text_trendin,
  value,
  range,
  checked,
}: DashCardProps) {
  // Load the appropriate data from the store.
  const dispatch = useTypedDispatch();
  useEffect(() => {
    dispatch(ReportingApi.fetchData(range)).then(console.log);
  }, [dispatch, range]);

  const chartData = useTypedSelector((state) => state.reporting.data[range]);

  return (
    <Card className="@container/card">
      <DashCardHeader
        description_header={description_header}
        value_TTC={chartData?.TTC ?? 0}
        value_HT={chartData?.HT ?? 0}
        trendin_header={trendin_header}
        value={String(value)}
        checked={checked}
      />
      <DashCardFooter
        text_trendin={text_trendin}
        trendin_footer={trendin_footer}
        description_footer={description_footer}
      />
    </Card>
  );
}
