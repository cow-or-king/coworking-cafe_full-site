"use client";

import { ColumnDef } from "@tanstack/react-table";

// Définir un type spécifique pour les données de Shift
export type ShiftData = {
  id: string;
  firstName: string;
  lastName: string;
  date: string; // Date du pointage
  heuredebut: string; // Heure de début du pointage
  heuredefin: string; // Heure de fin du pointage
};

export const columns: ColumnDef<ShiftData>[] = [
  {
    id: "firstName",
    header: "Nom",
    accessorKey: "firstName",
  },
  {
    id: "lastName",
    header: "Prénom",
    accessorKey: "lastName",
  },
  {
    id: "date",
    header: "Date",
    accessorKey: "date",
  },
  {
    id: "startTimeFirst",
    header: "Heure de Début (1)",
    accessorKey: "startTimeFirst",
  },
  {
    id: "endTimeFirst",
    header: "Heure de Fin (1)",
    accessorKey: "endTimeFirst",
  },
  {
    id: "startTimeSecond",
    header: "Heure de Début (2)",
    accessorKey: "startTimeSecond",
  },
  {
    id: "endTimeSecond",
    header: "Heure de Fin (2)",
    accessorKey: "endTimeSecond",
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  // },
];
