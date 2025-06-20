import { TrendingUp } from "lucide-react";
import { DashCard } from "./admin/dashboard/dash-SectionCard/dash-Card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <DashCard
        description_header={"New customers"}
        description_footer={"Visitors for the last 6 months"}
        title={"1,234"}
        value={"-25%"}
        trendin_header={<TrendingUp />}
        trendin_footer={<TrendingUp className="size-4" />}
        text_trendin={"Trending up this month"}
      />
      <DashCard
        description_header={"New customers"}
        description_footer={"Visitors for the last 6 months"}
        title={"1,234"}
        value={"-25%"}
        trendin_header={<TrendingUp />}
        trendin_footer={<TrendingUp className="size-4" />}
        text_trendin={"Trending up this month"}
      />
      <DashCard
        description_header={"New customers"}
        description_footer={"Visitors for the last 6 months"}
        title={"1,234"}
        value={"-25%"}
        trendin_header={<TrendingUp />}
        trendin_footer={<TrendingUp className="size-4" />}
        text_trendin={"Trending up this month"}
      />
      <DashCard
        description_header={"New customers"}
        description_footer={"Visitors for the last 6 months"}
        title={"1,234"}
        value={"-25%"}
        trendin_header={<TrendingUp />}
        trendin_footer={<TrendingUp className="size-4" />}
        text_trendin={"Trending up this month"}
      />
    </div>
  );
}
