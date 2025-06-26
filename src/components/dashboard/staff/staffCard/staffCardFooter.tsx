import { CardFooter } from "@/components/ui/card";

interface StaffCardFooterProps {
  start: string;
  end: string;
}

export default function StaffCardFooter({ start, end }: StaffCardFooterProps) {
  return (
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="flex w-full justify-between px-2">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Début de service
        </div>
        <div className="line-clamp-1 flex gap-2 font-medium">{start}</div>
      </div>
      <div className="flex w-full justify-between px-2">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Fin de service
        </div>
        <div className="line-clamp-1 flex gap-2 font-medium">{end}</div>
      </div>
    </CardFooter>
  );
}
