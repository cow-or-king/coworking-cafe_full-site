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
    id: "startTime",
    header: "Heure de Début",
    accessorKey: "startTime",
  },
  {
    id: "endTime",
    header: "Heure de Fin",
    accessorKey: "endTime",
  },
  {
    id: "actions",
    header: "Actions",
    // cell: ({ row }) => {
    //   const shift = row.original;
    //   return (
    //     <div className="flex items-center space-x-2">
    //       {/* Ajouter des boutons ou des actions ici */}
    //       <button
    //         onClick={() => console.log("Modifier", shift.id)}
    //         className="text-blue-500 hover:underline"
    //       >
    //         Modifier
    //       </button>
    //       <button
    //         onClick={() => console.log("Supprimer", shift.id)}
    //         className="text-red-500 hover:underline"
    //       >
    //         Supprimer
    //       </button>
    //     </div>
    //   );
    // },
  },
];
