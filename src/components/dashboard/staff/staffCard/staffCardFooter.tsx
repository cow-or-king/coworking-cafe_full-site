import { CardFooter } from "@/components/ui/card";

interface StaffCardFooterProps {
  startTime: string;
  endTime: string;
}

export default function StaffCardFooter({
  startTime,
  endTime,
}: StaffCardFooterProps) {
  return (
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="flex w-full justify-between">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Début de service
        </div>
        <div className="line-clamp-1 flex gap-2 font-medium">{startTime}</div>
      </div>
      <div className="flex w-full justify-between">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Fin de service
        </div>
        <div className="line-clamp-1 flex gap-2 font-medium">{endTime}</div>
      </div>
    </CardFooter>
  );
}
