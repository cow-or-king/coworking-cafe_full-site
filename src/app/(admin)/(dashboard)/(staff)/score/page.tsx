"use client";

import StaffCard from "@/components/dashboard/staff/staffCard";
import { StaffApi } from "@/store/staff";
import { useTypedDispatch, useTypedSelector } from "@/store/types";
import { useEffect } from "react";

export default function ScorePage() {
  const dispatch = useTypedDispatch();
  useEffect(() => {
    dispatch(StaffApi.fetchData()).then(console.log);
  }, [dispatch]);
  const data = useTypedSelector((state) => state.staff.data) ?? [];

  return (
    <div className="py-4">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {data.map((staff) => (
          <StaffCard
            key={staff.id}
            firstname={staff.firstName}
            lastname={staff.lastName}
            start={""}
            end={""}
          />
        ))}
      </div>
    </div>
  );
}
