import { Badge } from "@/components/ui/badge";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashCardHeaderProps = {
  description_header: string;
  value_TTC: number;
  value_HT: number;
  trendin_header: React.ReactNode;
  value: string;
  checked: boolean;
};

export function DashCardHeader({
  description_header,
  value_TTC,
  value_HT,
  trendin_header,
  value,
  checked,
}: DashCardHeaderProps) {
  const AmountFormatter = new Intl.NumberFormat("fr", {
    style: "currency",
    currency: "eur",
  });

  return (
    <CardHeader>
      <CardDescription>{description_header}</CardDescription>
      <CardTitle className="flex gap-2 text-2xl font-semibold tabular-nums">
        {!checked ? (
          <>
            <div className="text-end">
              <div>{AmountFormatter.format(value_HT)}</div>
              <div className="text-sm">{AmountFormatter.format(value_TTC)}</div>
            </div>
            <div className="text-start">
              <div>HT</div>
              <div className="text-sm">TTC</div>
            </div>
          </>
        ) : (
          <>
            <div className="text-end">
              <div>{AmountFormatter.format(value_TTC)}</div>
              <div className="text-sm">{AmountFormatter.format(value_HT)}</div>
            </div>
            <div className="text-start">
              <div>TTC</div>
              <div className="text-sm">HT</div>
            </div>
          </>
        )}
      </CardTitle>
      <CardAction>
        <Badge variant="outline">
          {trendin_header}
          {value}
        </Badge>
      </CardAction>
    </CardHeader>
  );
}
