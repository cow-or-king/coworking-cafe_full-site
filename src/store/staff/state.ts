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
  date: string | number | Date;
  mdp: number;
  _id: string;
  id: string;
  active: boolean;
  firstName: string;
  lastName: string;
  email: string;
  startTime: string;
  endTime: string;
  tel?: string; // Ajout de la propriété optionnelle 'tel'
}
