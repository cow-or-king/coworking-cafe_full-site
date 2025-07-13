"use client";

import { useEffect, useState } from "react";

// Types pour les données Staff (API MongoDB moderne)
interface StaffMemberFromAPI {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Champ moderne unifié
  numberSecu?: string;
  adresse?: string;
  zipcode?: string;
  city?: string;
  framework?: string;
  times?: string;
  hourlyRate?: number;
  startDate?: string;
  endDate?: string;
  contract?: string;
  mdp: number;
  isActive: boolean; // Champ moderne unifié
  createdAt?: string;
  updatedAt?: string;
}

// Types pour les composants (format unifié moderne)
interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Unifié vers le format moderne
  mdp: number;
  isActive: boolean; // Unifié vers le format moderne
}

const transformStaffData = (apiData: StaffMemberFromAPI[]): StaffMember[] => {
  return apiData.map((member) => ({
    id: member._id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email || "",
    phone: member.phone || "",
    mdp: member.mdp || 0,
    isActive: member.isActive ?? true,
  }));
};

export const useStaffDataFixed = () => {
  const [data, setData] = useState<StaffMember[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/staff");
        const result = await response.json();
        if (result.success) {
          setData(transformStaffData(result.data));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
