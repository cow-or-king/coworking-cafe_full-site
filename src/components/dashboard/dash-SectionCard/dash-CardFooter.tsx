import { CardFooter } from "@/components/ui/card";

type DashCardFooterProps = {
  text_trendin: React.ReactNode;
  trendin_footer: React.ReactNode;
  description_footer: React.ReactNode;
};

export function DashCardFooter({
  text_trendin,
  trendin_footer,
  description_footer,
}: DashCardFooterProps) {
  return (
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        {text_trendin}
        {trendin_footer}
      </div>
      <div className="text-muted-foreground">{description_footer}</div>
    </CardFooter>
  );
}
