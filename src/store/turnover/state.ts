export interface ChartDataItem {
  date: string;
  TTC: number;
  HT: number;
}

export interface TurnoverState {
  items(items: any): unknown;
  loading: boolean;
  data: ChartDataItem[] | undefined;
}

export const InitialTurnoverState: TurnoverState = {
  loading: true,
  data: undefined,
};
