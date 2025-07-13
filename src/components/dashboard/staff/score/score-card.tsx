"use client";

import StaffCard from "@/components/dashboard/staff/staff-card";
import { useStaffDataFixed } from "@/hooks/use-staff-data-fixed";

export default function ScoreCard({ hidden }: { hidden: string }) {
  const { data, isLoading, error } = useStaffDataFixed();

  if (isLoading) {
    return (
      <div className="">
        <div className="grid grid-cols-4 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <div className="text-destructive text-center">
          Erreur de chargement: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {data?.map(
          (staff) =>
            staff.isActive && ( // Utiliser le nouveau champ isActive
              <StaffCard
                key={`${staff.id} + ${staff.lastName}`}
                firstname={staff.firstName}
                lastname={staff.lastName}
                mdp={staff.mdp} // Assuming mdp is a property of the staff object
                staffId={staff.id} // Use the actual ID from the staff object
                hidden={hidden}
              />
            ),
        )}
      </div>
    </div>
  );
}
