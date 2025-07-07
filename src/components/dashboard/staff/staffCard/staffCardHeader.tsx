import { CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, TimerOff } from "lucide-react";

type StaffCardHeaderProps = {
  firstname: string;
  lastname: string;
  timer: boolean | null;
};

export default function StaffCardHeader({
  firstname,
  lastname,
  timer,
}: StaffCardHeaderProps) {
  return (
    <CardHeader>
      <div className="flex w-full items-center justify-between gap-2">
        <CardTitle className="flex flex-col text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          <div>{firstname}</div>
          <div>{lastname}</div>
        </CardTitle>

        {timer ? (
          <div className="flex cursor-pointer flex-col items-center gap-2">
            <TimerOff size={60} />
            STOP
          </div>
        ) : (
          <div className="flex cursor-pointer flex-col items-center gap-2">
            <Timer size={60} />
            START
          </div>
        )}
      </div>
    </CardHeader>
  );
}
