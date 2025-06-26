"use client";

import { Chart } from "@/components/dashboard/chart";
import { DashSectionCards } from "@/components/dashboard/dash-SectionCard";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DashboardPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <div className="flex justify-end px-8 pt-2">
        <div className="flex items-center gap-2">
          <span>HT</span>
          <Switch
            className={cn(
              "data-[state=checked]:bg-(--chart-4) data-[state=unchecked]:bg-(--chart-5)",
            )}
            onClick={() => setChecked(!checked)}
          />
          <span>TTC</span>
        </div>
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
