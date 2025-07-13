"use client";
import { TrendingUp } from "lucide-react";
import { DashCard } from "./section-card";

export function DashSectionCards({ checked }: { checked: boolean }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <DashCard
        description_header={"Journée précédente"}
        trendin_header={<TrendingUp className="size-4" />}
        // description_footer={"Visitors for the last 6 months"}
        trendin_footer={<TrendingUp className="size-4" />}
        text_trendin={"Tendance à la hausse"}
        range="yesterday"
        secRange="previousDay"
        checked={checked}
        compare="customPreviousDay"
        valueChartData={{
          HT: 0,
          TTC: 0,
        }} // Placeholder value, can be replaced with actual data
      />
      <DashCard
        description_header={"Semaine en cours"}
        trendin_header={<TrendingUp className="size-4" />}
        // description_footer={"Visitors for the last 6 months"}
        trendin_footer={<TrendingUp className="size-4" />}
        text_trendin={"Tendance à la hausse cette semaine"}
        range="week"
        secRange="previousWeek"
        checked={checked}
        compare="customPreviousWeek"
        valueChartData={{
          HT: 0,
          TTC: 0,
        }} // Placeholder value, can be replaced with actual data
      />
      <DashCard
        description_header={"Mois en cours"}
        trendin_header={<TrendingUp className="size-4" />}
        // description_footer={"Visitors for the last 6 months"}
        trendin_footer={<TrendingUp className="size-4" />}
        text_trendin={"Tendance à la hausse ce mois-ci"}
        range="month"
        secRange="previousMonth"
        checked={checked}
        compare="customPreviousMonth"
        valueChartData={{
          HT: 0,
          TTC: 0,
        }} // Placeholder value, can be replaced with actual data
      />
      <DashCard
        description_header={"Année en cours"}
        trendin_header={<TrendingUp className="size-4" />}
        // description_footer={"Visitors for the last 6 months"}
        trendin_footer={<TrendingUp className="size-4" />}
        text_trendin={"Tendance à la hausse sur l'année"}
        range="year"
        secRange="previousYear"
        checked={checked}
        compare="customPreviousYear"
        valueChartData={{
          HT: 0,
          TTC: 0,
        }} // Placeholder value, can be replaced with actual data
      />
    </div>
  );
}
