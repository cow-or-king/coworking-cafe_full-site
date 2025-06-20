export interface ChartDataItem {
  date: string;
  TTC: number;
  HT: number;
}

export interface ChartData {
  yesterday: ChartDataItem | undefined;
  week: ChartDataItem | undefined;
  month: ChartDataItem | undefined;
  year: ChartDataItem | undefined;
}

export interface ReportingState {
  loading: boolean;
  data: ChartData;
}

export const InitialReportingState: ReportingState = {
  loading: true,
  data: {
    yesterday: undefined,
    week: undefined,
    month: undefined,
    year: undefined,
  },
};
