import { Chart } from "../../../components/admin/dashboard/chart";

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 max-h-[200px] flex-1 rounded-xl md:min-h-min">
          <Chart />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl">
            <Chart />
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl">
            <Chart />
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl">
            <Chart />
          </div>
        </div>
      </div>
    </>
  );
}

const chartConfig = {
  TTC: {
    label: "TTC",
    color: "#2563eb",
  },
  HT: {
    label: "HT",
    color: "#60a5fa",
  },
} satisfies ChartConfig;
