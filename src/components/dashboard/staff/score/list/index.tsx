import { columns } from "@/components/dashboard/staff/score/list/columns";
import { DataTable } from "@/components/dashboard/staff/score/list/data-table";
import { StaffApi } from "@/store/staff";
import { useTypedDispatch } from "@/store/types";
import { useEffect, useMemo, useState } from "react";

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

  const [filter, setFilter] = useState({ months: "", user: "" });
  const [users, setUsers] = useState<string[]>([]);
  const [shiftDates, setShiftDates] = useState<Date[]>([]);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(StaffApi.fetchData());

    // Récupérer les utilisateurs uniques de la base de données Shift
    const fetchUsersAndDates = async () => {
      try {
        const response = await fetch("/api/shift/users");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs.");
        }
        const result: { users: string[]; dates: string[] } =
          await response.json();
        console.log("Réponse brute de l'API GET /api/shift/users :", result);

        setUsers(result.users || []);

        // Extraire les dates des entrées Shift
        const dates = result.dates || [];
        const parsedDates = dates
          .map((dateStr: string) => new Date(dateStr))
          .filter((date: Date) => !isNaN(date.getTime()));
        setShiftDates(parsedDates);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs et des dates :",
          error,
        );
      }
    };

    fetchUsersAndDates();
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

  // TODO: Replace this with your actual data fetching logic
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Example fetch, replace with your actual API endpoint if needed
    const fetchData = async () => {
      try {
        const response = await fetch("/api/score/list");
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des scores.");
        const result = await response.json();
        setData(result || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des scores :", error);
        setData([]);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => {
        const d = new Date(item.date);
        const yearMatch = selectedYear
          ? d.getFullYear() === selectedYear
          : true;
        const monthMatch =
          selectedMonth !== null ? d.getMonth() === selectedMonth : true;
        return yearMatch && monthMatch;
      })
      .map((item) => ({
        ...item,
        startTime: item.startTime || "", // Ajout de startTime
        endTime: item.endTime || "", // Ajout de endTime
      }));
  }, [data, selectedYear, selectedMonth]);

  const filteredUsers = useMemo(() => {
    if (!data || selectedMonth === null || selectedYear === null) return users;

    // Filtrer les utilisateurs en fonction des données pour le mois et l'année sélectionnés
    const usersForSelectedMonth = data
      .filter((item) => {
        const d = new Date(item.date);
        return (
          d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
        );
      })
      .map((item) => `${item.firstName} ${item.lastName}`); // Concaténer nom et prénom

    return Array.from(new Set(usersForSelectedMonth)); // Supprimer les doublons
  }, [data, selectedMonth, selectedYear, users]);

  useEffect(() => {
    console.log("Données brutes:", data);
    console.log("Données filtrées:", filteredData);
  }, [data, filteredData]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-semibold">Année :</span>
          <select
            className="mr-4 rounded border px-3 py-1"
            value={selectedYear ?? ""}
            onChange={(e) =>
              setSelectedYear(e.target.value ? Number(e.target.value) : null)
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
            className="rounded border px-3 py-1"
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
        </div>
        <div className="mb-4 flex items-center gap-2">
          <label className="font-semibold" htmlFor="user">
            Utilisateur :
          </label>
          <select
            id="user"
            value={filter.user}
            onChange={(e) => setFilter({ ...filter, user: e.target.value })}
            className="rounded border p-2"
          >
            {/* <option value="">Tous les utilisateurs</option> */}
            {filteredUsers.map(
              (user) => (
                console.log("User option:", user),
                (
                  <option key={user} value={user}>
                    {user}
                  </option>
                )
              ),
            )}
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} checked={true} />
    </div>
  );
}

export const metadata = {
  title: "Score List",
  description:
    "List of daily scores for staff members, sortable by month and user",
};
