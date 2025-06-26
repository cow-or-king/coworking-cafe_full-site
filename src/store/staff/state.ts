export interface StaffState {
  loading: boolean;
  data: Staff[] | undefined;
  error: string | null;
  success: boolean;
}

export const InitialStaffState: StaffState = {
  loading: false,
  data: undefined,
  success: false,
  error: null as string | null,
};

export interface Staff {
  startTime: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
