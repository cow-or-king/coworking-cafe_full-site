"use client";
import { DataTable } from "@/components/admin/dashboard/accounting/cash-control/data-table";
import { TurnoverApi } from "@/store/turnover";
import { useTypedDispatch, useTypedSelector } from "@/store/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns } from "./columns";

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

export default function CashControl() {
  const dispatch = useTypedDispatch();
  const { data, loading } = useTypedSelector((state) => state.turnover);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    currentMonth,
  );
  const [form, setForm] = useState<any>({
    _id: "",
    date: "",
    depenses: [{ label: "", value: "" }],
    especes: "",
    cbClassique: "",
    cbSansContact: "",
  });
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<any | null>(null);

  useEffect(() => {
    dispatch(TurnoverApi.fetchData());
  }, [dispatch]);

  const years = useMemo(() => {
    if (!data) return [];
    const allYears = data.map((item) => new Date(item.date).getFullYear());
    return Array.from(new Set(allYears)).sort((a, b) => b - a);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const d = new Date(item.date);
      const yearMatch = selectedYear ? d.getFullYear() === selectedYear : true;
      const monthMatch =
        selectedMonth !== null ? d.getMonth() === selectedMonth : true;
      return yearMatch && monthMatch;
    });
  }, [data, selectedYear, selectedMonth]);

  // Handler pour ouvrir le formulaire depuis la colonne action
  const openForm = useCallback((row: any) => {
    setEditingRow(row);
    let dateStr = row.date || new Date().toISOString().slice(0, 10);
    setForm({
      _id: row._id || "",
      date: dateStr,
      depenses:
        Array.isArray(row.depenses) && row.depenses.length > 0
          ? row.depenses
          : [{ label: "", value: "" }],
      especes: row.especes ?? "",
      cbClassique: row["cb-classique"] ?? "",
      cbSansContact: row["cb-sans-contact"] ?? "",
    });
  }, []);

  // Handler pour suppression (à adapter selon ton API)
  const handleDelete = useCallback((row: any) => {
    if (!window.confirm("Supprimer cette ligne ?")) return;
    // Appel API suppression ici, puis refresh
    // ...
  }, []);

  // Handler de soumission du formulaire (à adapter selon ton API)
  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus(null);
    // ... logique d'envoi (POST/PUT) ...
    setEditingRow(null);
    setForm({
      _id: "",
      date: "",
      depenses: [{ label: "", value: "" }],
      especes: "",
      cbClassique: "",
      cbSansContact: "",
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
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
          {monthsList.map((month, idx) => (
            <option key={month} value={idx}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        form={form}
        setForm={setForm}
        formStatus={formStatus}
        onSubmit={onSubmit}
        editingRow={editingRow}
        onDelete={handleDelete}
      />
    </div>
  );
}
