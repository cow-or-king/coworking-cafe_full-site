"use client";
import { DataTable } from "@/components/admin/dashboard/accounting/cash-control/data-table";
import { CashEntryApi } from "@/store/cashentry";
import { TurnoverApi } from "@/store/turnover";

import { useTypedDispatch, useTypedSelector } from "@/store/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
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

// Utilitaire pour formater une date en YYYY/MM/DD
function formatDateYYYYMMDD(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export default function CashControl() {
  const dispatch = useTypedDispatch();
  const { data, loading } = useTypedSelector((state) => state.turnover);
  const { dataCash, reloading, error } = useTypedSelector(
    (state) => state.cashentry,
  );
  console.log("CashControl data", dataCash);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
  const currentMonth = new Date().getMonth();
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
  useEffect(() => {
    dispatch(CashEntryApi.fetchCashEntries());
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

  const mergedData = useMemo(() => {
    if (!filteredData || !dataCash) return [];
    return filteredData.map((turnoverItem) => {
      const dateKey = formatDateYYYYMMDD(turnoverItem.date);
      const cashEntry = dataCash.find(
        (entry) => formatDateYYYYMMDD(entry._id) === dateKey,
      );
      return {
        ...turnoverItem,
        ...cashEntry,
        _id: cashEntry?._id || "",
        date: dateKey,
      };
    });
  }, [filteredData, dataCash]);

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
      cbClassique: row.cbClassique ?? "",
      cbSansContact: row.cbSansContact ?? "",
    });
  }, []);

  // Handler pour suppression (à adapter selon ton API)
  const handleDelete = useCallback(
    async (row: any) => {
      // On utilise l'_id réel de cashentry
      const id = row._id;

      if (!id) {
        alert("Impossible de supprimer : identifiant manquant");
        return;
      }
      try {
        const res = await fetch(`/api/dashboard/cash-entry/delete?id=${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        dispatch(CashEntryApi.fetchCashEntries());
        setFormStatus("Suppression réussie");
      } catch (err) {
        setFormStatus("Erreur lors de la suppression");
      }
    },
    [dispatch],
  );

  // Affiche un toast visuel lors d'un succès ou d'une erreur
  useEffect(() => {
    if (formStatus) {
      toast(formStatus, {
        icon: formStatus.toLowerCase().includes("erreur") ? "❌" : "✅",
        duration: 3000,
      });
      setFormStatus(null);
    }
  }, [formStatus]);

  // Handler de soumission du formulaire (à adapter selon ton API)
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormStatus(null);
      // Normalisation de la date (YYYY-MM-DD)
      let dateToSend = form.date;
      if (dateToSend.includes("/")) {
        dateToSend = dateToSend.replaceAll("/", "-");
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateToSend)) {
        const d = new Date(dateToSend);
        if (!isNaN(d.getTime())) {
          dateToSend = d.toISOString().slice(0, 10);
        }
      }
      // Construction du body
      const bodyData: any = {
        date: dateToSend,
        depenses: form.depenses
          .filter(
            (d: any) => d.label && d.value !== "" && !isNaN(Number(d.value)),
          )
          .map((d: any) => ({ label: d.label, value: Number(d.value) })),
        especes: form.especes !== "" ? Number(form.especes) : 0,
        cbClassique: form.cbClassique !== "" ? Number(form.cbClassique) : 0,
        cbSansContact:
          form.cbSansContact !== "" ? Number(form.cbSansContact) : 0,
      };
      let url = "/api/dashboard/cash-entry";
      let method: "POST" | "PUT" = "POST";
      if (form._id) {
        url = "/api/dashboard/cash-entry/update";
        method = "PUT";
        bodyData.id = form._id;
      }
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        const result = await res.json();
        if (result.success) {
          setFormStatus(form._id ? "Modification réussie !" : "Ajout réussi !");
          dispatch(CashEntryApi.fetchCashEntries());
          setEditingRow(null); // Ferme la fenêtre de saisie
          window.dispatchEvent(new CustomEvent("cash-modal-close")); // Force la fermeture de la modale DataTable
          setForm({
            _id: "",
            date: "",
            depenses: [{ label: "", value: "" }],
            especes: "",
            cbClassique: "",
            cbSansContact: "",
          });
        } else {
          setFormStatus(
            "Erreur : " + (result.error || "Impossible d'enregistrer"),
          );
        }
      } catch (err) {
        setFormStatus("Erreur réseau");
      }
    },
    [form, dispatch],
  );

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
        data={mergedData}
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
