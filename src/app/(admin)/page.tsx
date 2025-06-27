"use client";

import { Chart } from "@/components/dashboard/chart";
import { DashSectionCards } from "@/components/dashboard/dash-SectionCard";
import SwitchWithText from "@/components/dashboard/switchWithText";
import { useState } from "react";

export default function DashboardPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <div className="flex justify-end px-8 pt-2">
        <SwitchWithText
          checked={checked}
          setChecked={setChecked}
          firstText="HT"
          secondText="TTC"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DashSectionCards checked={checked} />
            <div className="px-4 lg:px-6">
              <Chart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
