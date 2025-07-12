"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditableCell } from "./editable-cell";

// Définir un type spécifique pour les données de Shift
export type ShiftData = {
  _id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  date: string;
  firstShift: {
    start: string;
    end: string;
  };
  secondShift: {
    start: string;
    end: string;
  };
};

// Type pour les props de mise à jour
export type UpdateShiftProps = {
  shiftId: string;
  field: string;
  value: string;
};

// Fonction pour vérifier si une valeur de shift est vide
const isEmptyShiftValue = (value: string): boolean => {
  return !value || value === "00:00" || value === "0000-01-01T00:00:00.000Z";
};

// Fonction pour vérifier si un shift entier est vide
const isEmptyShift = (shift: { start: string; end: string }): boolean => {
  return isEmptyShiftValue(shift.start) && isEmptyShiftValue(shift.end);
};

// Fonction pour vérifier si un shift est incomplet (début sans fin)
const isIncompleteShift = (start: string, end: string): boolean => {
  const hasStart = !isEmptyShiftValue(start);
  const hasEnd = !isEmptyShiftValue(end);
  return hasStart && !hasEnd;
};

// Fonction pour formater l'heure ISO en format HH:MM
const formatTime = (isoString: string) => {
  if (!isoString || isoString === "00:00" || isNaN(Date.parse(isoString)))
    return "--:--";
  const date = new Date(isoString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Fonction pour vérifier si une heure est après 14h30
const isAfternoonShift = (timeString: string) => {
  if (!timeString || timeString === "00:00") return false;
  try {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // Après 14h30 = 14:30 et plus
    return hours > 14 || (hours === 14 && minutes >= 30);
  } catch {
    return false;
  }
};

// Fonction pour réorganiser les shifts selon la logique métier
const getDisplayShifts = (data: ShiftData) => {
  const { firstShift, secondShift } = data;

  // Initialiser les valeurs d'affichage
  let displayFirstStart = "--:--";
  let displayFirstEnd = "--:--";
  let displaySecondStart = "--:--";
  let displaySecondEnd = "--:--";

  // Vérifier si les shifts ont des starts valides (on ne montre que les shifts avec un start)
  const hasFirstShift = !isEmptyShiftValue(firstShift.start);
  const hasSecondShift = !isEmptyShiftValue(secondShift.start);

  // Cas spécial : Si les deux shifts sont après 14h30, les afficher dans chaque colonne
  if (hasFirstShift && hasSecondShift) {
    const firstIsAfternoon = isAfternoonShift(firstShift.start);
    const secondIsAfternoon = isAfternoonShift(secondShift.start);

    if (firstIsAfternoon && secondIsAfternoon) {
      // Les deux sont après 14h30 → afficher chacun dans sa colonne
      displayFirstStart = formatTime(firstShift.start);
      displayFirstEnd = formatTime(firstShift.end);
      displaySecondStart = formatTime(secondShift.start);
      displaySecondEnd = formatTime(secondShift.end);

      return {
        firstShiftStart: displayFirstStart,
        firstShiftEnd: displayFirstEnd,
        secondShiftStart: displaySecondStart,
        secondShiftEnd: displaySecondEnd,
      };
    }
  }

  // Logique normale : traiter chaque shift selon sa propre heure
  // Traiter firstShift s'il existe et a un start valide
  if (hasFirstShift) {
    if (isAfternoonShift(firstShift.start)) {
      // Après 14h30 → va en Shift 2
      displaySecondStart = formatTime(firstShift.start);
      displaySecondEnd = formatTime(firstShift.end);
    } else {
      // Avant 14h30 → va en Shift 1
      displayFirstStart = formatTime(firstShift.start);
      displayFirstEnd = formatTime(firstShift.end);
    }
  }

  // Traiter secondShift s'il existe et a un start valide
  if (hasSecondShift) {
    if (isAfternoonShift(secondShift.start)) {
      // Après 14h30 → va en Shift 2 (remplace si déjà occupé, sauf cas spécial ci-dessus)
      displaySecondStart = formatTime(secondShift.start);
      displaySecondEnd = formatTime(secondShift.end);
    } else {
      // Avant 14h30 → va en Shift 1 (remplace si déjà occupé)
      displayFirstStart = formatTime(secondShift.start);
      displayFirstEnd = formatTime(secondShift.end);
    }
  }

  return {
    firstShiftStart: displayFirstStart,
    firstShiftEnd: displayFirstEnd,
    secondShiftStart: displaySecondStart,
    secondShiftEnd: displaySecondEnd,
  };
};

// Fonction pour créer les colonnes avec le callback de mise à jour
export const createColumns = (
  onUpdateShift: (update: UpdateShiftProps) => Promise<void>,
): ColumnDef<ShiftData>[] => [
  {
    id: "firstName",
    header: "Prénom",
    accessorKey: "firstName",
  },
  {
    id: "lastName",
    header: "Nom",
    accessorKey: "lastName",
  },
  {
    id: "date",
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString("fr-FR");
    },
  },
  {
    id: "firstShiftStart",
    header: "Début Shift 1",
    cell: ({ row }) => {
      const shifts = getDisplayShifts(row.original);

      // Si getDisplayShifts dit qu'il n'y a rien à afficher ici, ne rien afficher
      if (shifts.firstShiftStart === "--:--") {
        return ""; // Cellule vide
      }

      // Déterminer quelle donnée est affichée
      const isFromSecondShift =
        shifts.firstShiftStart === formatTime(row.original.secondShift.start);

      return (
        <EditableCell
          value={
            isFromSecondShift
              ? row.original.secondShift.start
              : row.original.firstShift.start
          }
          onSave={(newValue) =>
            onUpdateShift({
              shiftId: row.original._id,
              field: isFromSecondShift
                ? "secondShift.start"
                : "firstShift.start",
              value: newValue,
            })
          }
          type="time"
          placeholder="HH:MM"
        />
      );
    },
  },
  {
    id: "firstShiftEnd",
    header: "Fin Shift 1",
    cell: ({ row }) => {
      const shifts = getDisplayShifts(row.original);

      // Si le shift de début n'est pas affiché, ne pas afficher la fin non plus
      if (shifts.firstShiftStart === "--:--") {
        return "";
      }

      if (shifts.firstShiftEnd === "--:--") {
        // Déterminer quel champ éditer selon l'affichage du début
        const isEditingSecondShift =
          shifts.firstShiftStart === formatTime(row.original.secondShift.start);

        return (
          <EditableCell
            value={
              isEditingSecondShift
                ? row.original.secondShift.end
                : row.original.firstShift.end
            }
            onSave={(newValue) =>
              onUpdateShift({
                shiftId: row.original._id,
                field: isEditingSecondShift
                  ? "secondShift.end"
                  : "firstShift.end",
                value: newValue,
              })
            }
            type="time"
            placeholder="HH:MM"
          />
        );
      }

      const isFromSecondShift =
        shifts.firstShiftEnd === formatTime(row.original.secondShift.end);

      return (
        <EditableCell
          value={
            isFromSecondShift
              ? row.original.secondShift.end
              : row.original.firstShift.end
          }
          onSave={(newValue) =>
            onUpdateShift({
              shiftId: row.original._id,
              field: isFromSecondShift ? "secondShift.end" : "firstShift.end",
              value: newValue,
            })
          }
          type="time"
          placeholder="HH:MM"
        />
      );
    },
  },
  {
    id: "secondShiftStart",
    header: "Début Shift 2",
    cell: ({ row }) => {
      const shifts = getDisplayShifts(row.original);

      if (shifts.secondShiftStart === "--:--") {
        return ""; // Cellule vide
      }

      const isFromFirstShift =
        shifts.secondShiftStart === formatTime(row.original.firstShift.start);

      return (
        <EditableCell
          value={
            isFromFirstShift
              ? row.original.firstShift.start
              : row.original.secondShift.start
          }
          onSave={(newValue) =>
            onUpdateShift({
              shiftId: row.original._id,
              field: isFromFirstShift
                ? "firstShift.start"
                : "secondShift.start",
              value: newValue,
            })
          }
          type="time"
          placeholder="HH:MM"
        />
      );
    },
  },
  {
    id: "secondShiftEnd",
    header: "Fin Shift 2",
    cell: ({ row }) => {
      const shifts = getDisplayShifts(row.original);

      // Si le shift de début n'est pas affiché, ne pas afficher la fin non plus
      if (shifts.secondShiftStart === "--:--") {
        return "";
      }

      if (shifts.secondShiftEnd === "--:--") {
        // Déterminer quel champ éditer selon l'affichage du début
        const isEditingFirstShift =
          shifts.secondShiftStart === formatTime(row.original.firstShift.start);

        return (
          <EditableCell
            value={
              isEditingFirstShift
                ? row.original.firstShift.end
                : row.original.secondShift.end
            }
            onSave={(newValue) =>
              onUpdateShift({
                shiftId: row.original._id,
                field: isEditingFirstShift
                  ? "firstShift.end"
                  : "secondShift.end",
                value: newValue,
              })
            }
            type="time"
            placeholder="HH:MM"
          />
        );
      }

      const isFromFirstShift =
        shifts.secondShiftEnd === formatTime(row.original.firstShift.end);

      return (
        <EditableCell
          value={
            isFromFirstShift
              ? row.original.firstShift.end
              : row.original.secondShift.end
          }
          onSave={(newValue) =>
            onUpdateShift({
              shiftId: row.original._id,
              field: isFromFirstShift ? "firstShift.end" : "secondShift.end",
              value: newValue,
            })
          }
          type="time"
          placeholder="HH:MM"
        />
      );
    },
  },
];

// Export des colonnes par défaut pour la rétrocompatibilité
export const columns: ColumnDef<ShiftData>[] = [
  {
    id: "firstName",
    header: "Prénom",
    accessorKey: "firstName",
  },
  {
    id: "lastName",
    header: "Nom",
    accessorKey: "lastName",
  },
  {
    id: "date",
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString("fr-FR");
    },
  },
  {
    id: "firstShiftStart",
    header: "Début Shift 1",
    cell: ({ row }) => {
      const shifts = getDisplayShifts(row.original);
      return shifts.firstShiftStart;
    },
  },
  {
    id: "firstShiftEnd",
    header: "Fin Shift 1",
    cell: ({ row }) => {
      const shifts = getDisplayShifts(row.original);
      return shifts.firstShiftEnd;
    },
  },
  {
    id: "secondShiftStart",
    header: "Début Shift 2",
    cell: ({ row }) => {
      const shifts = getDisplayShifts(row.original);
      return shifts.secondShiftStart;
    },
  },
  {
    id: "secondShiftEnd",
    header: "Fin Shift 2",
    cell: ({ row }) => {
      const shifts = getDisplayShifts(row.original);
      return shifts.secondShiftEnd;
    },
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     // Actions pour modifier/supprimer si nécessaire
  //   },
  // },
];
