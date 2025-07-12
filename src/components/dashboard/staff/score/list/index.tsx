import {
  createColumns,
  ShiftData,
  UpdateShiftProps,
} from "@/components/dashboard/staff/score/list/columns";
import { StaffApi } from "@/store/staff";
import { useTypedDispatch } from "@/store/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { ShiftDataTable } from "./shift-data-table";

const monthsList = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
// Utilitaire pour formater une date en YYYY/MM/DD
function formatDateYYYYMMDD(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export default function ScoreList() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    currentMonth,
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // État pour le jour sélectionné

  const [shiftDates, setShiftDates] = useState<Date[]>([]);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(StaffApi.fetchData());

    // Récupérer les shifts de la base de données
    const fetchShifts = async () => {
      try {
        const response = await fetch("/api/shift/list");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des shifts.");
        }
        const result = await response.json();
        console.log("Shifts récupérés :", result);
        setData(result.shifts || []);

        const dates = (result.shifts || []).map(
          (shift: ShiftData) => new Date(shift.date),
        );
        const validDates = dates.filter((date: Date) => !isNaN(date.getTime()));
        setShiftDates(validDates);
      } catch (error) {
        console.error("Erreur lors de la récupération des shifts :", error);
        setData([]);
      }
    };

    fetchShifts();
  }, [dispatch]);

  const years = useMemo(() => {
    if (!shiftDates) return [];
    const allYears = shiftDates.map((date: Date) => date.getFullYear());
    return Array.from(new Set(allYears)).sort((a, b) => b - a);
  }, [shiftDates]);

  const months = useMemo(() => {
    if (!shiftDates || !selectedYear) return [];
    const allMonths = shiftDates
      .filter((date: Date) => date.getFullYear() === selectedYear)
      .map((date: Date) => date.getMonth());
    const uniqueMonths = Array.from(new Set(allMonths)).sort((a, b) => a - b);
    console.log("Mois calculés:", uniqueMonths);
    return uniqueMonths;
  }, [shiftDates, selectedYear]);

  const days = useMemo(() => {
    if (!shiftDates || selectedYear === null || selectedMonth === null)
      return [];
    const allDays = shiftDates
      .filter(
        (date: Date) =>
          date.getFullYear() === selectedYear &&
          date.getMonth() === selectedMonth,
      )
      .map((date: Date) => date.getDate());
    return Array.from(new Set(allDays)).sort((a, b) => a - b);
  }, [shiftDates, selectedYear, selectedMonth]);

  // État pour stocker les données de shifts
  const [data, setData] = useState<ShiftData[]>([]);

  // Fonction pour mettre à jour un shift
  const handleUpdateShift = async (update: UpdateShiftProps) => {
    try {
      const response = await fetch("/api/shift/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du shift");
      }

      const result = await response.json();

      // Mettre à jour les données localement
      setData((prevData) =>
        prevData.map((shift) =>
          shift._id === update.shiftId ? { ...shift, ...result.shift } : shift,
        ),
      );

      toast.success("Shift mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du shift");
    }
  };

  // Créer les colonnes avec la fonction de mise à jour
  const editableColumns = useMemo(() => createColumns(handleUpdateShift), []);

  // Filtrer les données selon année, mois et jour seulement
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const d = new Date(item.date);
      const yearMatch = selectedYear ? d.getFullYear() === selectedYear : true;
      const monthMatch =
        selectedMonth !== null ? d.getMonth() === selectedMonth : true;
      const dayMatch =
        selectedDay !== null ? d.getDate() === selectedDay : true;
      return yearMatch && monthMatch && dayMatch;
    });
  }, [data, selectedYear, selectedMonth, selectedDay]);

  useEffect(() => {
    console.log("Données brutes:", data);
    console.log("Données filtrées:", filteredData);
  }, [data, filteredData]);

  return (
    <div className="container mx-auto px-4">
      <div className="rounded-md border">
        <div className="p-4">
          <div className="flex justify-between">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="font-semibold">Année :</span>
              <select
                className="mr-4 rounded border px-3 py-1"
                value={selectedYear ?? ""}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <span className="font-semibold">Mois :</span>
              <select
                className="mr-4 rounded border px-3 py-1"
                value={selectedMonth ?? ""}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value !== "" ? Number(e.target.value) : null,
                  )
                }
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {monthsList[month]}
                  </option>
                ))}
              </select>
              <span className="font-semibold">Jour :</span>
              <select
                className="rounded border px-3 py-1"
                value={selectedDay ?? ""}
                onChange={(e) =>
                  setSelectedDay(
                    e.target.value !== "" ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">Tous les jours</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ShiftDataTable columns={editableColumns} data={filteredData} />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Score List",
  description:
    "List of daily scores for staff members, sortable by month and user",
};
