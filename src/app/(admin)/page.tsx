"use client";

import { Chart } from "@/components/dashboard/chart";
import { DashSectionCards } from "@/components/dashboard/dash-SectionCard";
import ScoreCard from "@/components/dashboard/staff/score/scoreCard";
import SwitchWithText from "@/components/dashboard/switchWithText";
import { useState } from "react";

export default function DashboardPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <ScoreCard hidden={""} />
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex justify-end px-8">
            <SwitchWithText
              checked={checked}
              setChecked={setChecked}
              firstText="HT"
              secondText="TTC"
            />
          </div>
          <DashSectionCards checked={checked} />
          <div className="px-4 lg:px-6">
            <Chart />
          </div>
        </div>
      </div>
    </div>
  );
}
