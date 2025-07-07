import { Badge } from "@/components/ui/badge";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

type DashCardHeaderProps = {
  description_header: string;
  value_TTC: number;
  value_HT: number;
  checked: boolean;
  compareTTC: number; // Optional for future enhancements, can be used to compare TTC values.
  compareHT: number; // Optional for future enhancements, can be used to compare HT values
};

export function DashCardHeader({
  description_header,
  value_TTC,
  value_HT,
  checked,
  compareTTC,
  compareHT, // These are the values for comparison, can be used for future enhancements.

  // Default value for comparison range
}: DashCardHeaderProps) {
  const AmountFormatter = new Intl.NumberFormat("fr", {
    style: "currency",
    currency: "eur",
  });

  // Calculer le pourcentage de comparaison
  const percentageChangeTTC = compareTTC
    ? ((value_TTC - compareTTC) / compareTTC) * 100
    : 0;
  const percentageChangeHT = compareHT
    ? ((value_HT - compareHT) / compareHT) * 100
    : 0;

  // let textColor = "text-red-500";
  const textColor =
    percentageChangeHT && percentageChangeTTC > 0
      ? "text-green-500"
      : "text-red-500";

  // if (percentageChangeHT < 0) {
  //   setTrendinHeader(<TrendingDown className="size-4" />);
  //   textColor = "text-red-500";
  // } else {
  //   setTrendinHeader(<TrendingUp className="size-4" />);
  //   textColor = "text-green-500";
  // }

  return (
    <CardHeader>
      <CardDescription>{description_header}</CardDescription>
      <CardTitle className="flex gap-2 text-2xl font-semibold tabular-nums">
        {!checked ? (
          <>
            <div className="text-end">
              <div>{AmountFormatter.format(value_HT)}</div>
              <div className="text-sm">{AmountFormatter.format(value_TTC)}</div>
              {/* <div className="text-sm">{percentageChange.toFixed(2)}%</div> */}
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
          {percentageChangeHT && percentageChangeTTC > 0 ? (
            <TrendingUp className="size-4" />
          ) : (
            <TrendingDown className="size-4" />
          )}

          {checked ? (
            <>
              <span className={textColor}>
                {percentageChangeTTC.toFixed(2)}%
              </span>
            </>
          ) : (
            <span className={textColor}>{percentageChangeHT.toFixed(2)}%</span>
          )}
        </Badge>
      </CardAction>
    </CardHeader>
  );
}
