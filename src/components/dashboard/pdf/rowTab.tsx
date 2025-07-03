import ViewLibelle from "./viewLibelle";
import ViewValue from "./viewValue";

interface RowTabProps {
  firstCol: string;
  secCol: string;
  thirdCol: string;
  fourthCol: string;
  fiveCol: string;
  sixthCol: string;
  seventhCol: string;
  eighthCol: string;
  ninthCol: string;
  tenthCol: string;
}

export default function RowTab({
  firstCol,
  secCol,
  thirdCol,
  fourthCol,
  fiveCol,
  sixthCol,
  seventhCol,
  eighthCol,
  ninthCol,
  tenthCol,
}: RowTabProps) {
  return (
    <>
      <ViewLibelle value={firstCol} />
      <ViewValue value={secCol} />
      {thirdCol ? <ViewValue value={thirdCol} /> : null}
      {fourthCol ? <ViewValue value={fourthCol} /> : null}
      {fiveCol ? <ViewValue value={fiveCol} /> : null}
      {sixthCol ? <ViewValue value={sixthCol} /> : null}
      {seventhCol ? <ViewValue value={seventhCol} /> : null}
      {eighthCol ? <ViewValue value={eighthCol} /> : null}
      {ninthCol ? <ViewValue value={ninthCol} /> : null}
      {tenthCol ? <ViewValue value={tenthCol} /> : null}
    </>
  );
}
