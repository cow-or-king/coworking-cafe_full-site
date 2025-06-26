"use client";
import { DataTable } from "@/components/dashboard/accounting/cash-control/data-table";
import { CashEntryApi } from "@/store/cashentry";
import { TurnoverApi } from "@/store/turnover";

// Extend CashEntry type to include prestaB2B
type CashEntry = {
  _id: string;
  date: string;
  depenses?: { label: string; value: number }[];
  prestaB2B: { label: string; value: number }[]; // Not optional anymore
  especes?: number | string;
  cbClassique?: number | string;
  cbSansContact?: number | string;
  [key: string]: unknown;
};

import { columns } from "@/components/dashboard/accounting/cash-control/columns";
import { useTypedDispatch, useTypedSelector } from "@/store/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

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

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    currentMonth,
  );
  type FormState = {
    _id: string;
    date: string;
    prestaB2B: { label: string; value: string }[];
    depenses: { label: string; value: string }[];
    especes: string;
    cbClassique: string;
    cbSansContact: string;
  };

  const [form, setForm] = useState<FormState>({
    _id: "",
    date: "",
    prestaB2B: [{ label: "", value: "" }],
    depenses: [{ label: "", value: "" }],
    especes: "",
    cbClassique: "",
    cbSansContact: "",
  });
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<CashEntryRow | null>(null);

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
      // On laisse prestaB2B tel que reçu de cashEntry
      return {
        ...turnoverItem,
        ...cashEntry,
        _id: cashEntry?._id || "",
        date: dateKey,
        TVA: (turnoverItem as any).TVA ?? 0,
      };
    });
  }, [filteredData, dataCash]);

  // Handler pour ouvrir le formulaire depuis la colonne action
  const openForm = useCallback((row: CashEntryRow) => {
    setEditingRow(row);
    const dateStr = row.date || new Date().toISOString().slice(0, 10);
    setForm({
      _id: row._id || "",
      date: dateStr,
      prestaB2B:
        Array.isArray(row.prestaB2B) && row.prestaB2B.length > 0
          ? row.prestaB2B.map((p: any) => ({
              label: p.label ?? "",
              value:
                p.value !== undefined && p.value !== null
                  ? String(p.value)
                  : "",
            }))
          : [{ label: "", value: "" }],
      depenses:
        Array.isArray(row.depenses) && row.depenses.length > 0
          ? row.depenses.map((d: any) => ({
              label: d.label ?? "",
              value:
                d.value !== undefined && d.value !== null
                  ? String(d.value)
                  : "",
            }))
          : [{ label: "", value: "" }],
      especes:
        row.especes !== undefined && row.especes !== null
          ? String(row.especes)
          : "",
      cbClassique:
        row.cbClassique !== undefined && row.cbClassique !== null
          ? String(row.cbClassique)
          : "",
      cbSansContact:
        row.cbSansContact !== undefined && row.cbSansContact !== null
          ? String(row.cbSansContact)
          : "",
    });
  }, []);

  // Définir un type pour les lignes de cash entry
  type CashEntryRow = {
    _id?: string;
    date?: string;
    depenses?: { label: string; value: number }[];
    prestaB2B?: { label: string; value: number }[]; // Ajout de la propriété prestaB2B
    especes?: number | string;
    cbClassique?: number | string;
    cbSansContact?: number | string;
    [key: string]: unknown;
  };

  // Handler pour suppression (à adapter selon ton API)
  const handleDelete = useCallback(
    async (row: CashEntryRow) => {
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
      } catch {
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
      const dateKey = formatDateYYYYMMDD(dateToSend);
      type CashEntryBody = {
        date: string;
        prestaB2B?: { label: string; value: number }[];
        depenses: { label: string; value: number }[];
        especes: number;
        cbClassique: number;
        cbSansContact: number;
        _id?: string;
        id?: string;
      };

      const bodyData: CashEntryBody = {
        date: dateToSend,
        prestaB2B: form.prestaB2B
          .filter(
            (p: { label: string; value: string }) =>
              p.label && p.value !== "" && !isNaN(Number(p.value)),
          )
          .map((p: { label: string; value: string }) => ({
            label: p.label,
            value: Number(p.value),
          })),
        depenses: form.depenses
          .filter(
            (d: { label: string; value: string }) =>
              d.label && d.value !== "" && !isNaN(Number(d.value)),
          )
          .map((d: { label: string; value: string }) => ({
            label: d.label,
            value: Number(d.value),
          })),
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
      } else {
        // Pour POST, il faut fournir _id au format YYYY/MM/DD
        bodyData._id = dateKey;
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
            prestaB2B: [{ label: "", value: "" }],
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
      } catch {
        setFormStatus("Erreur réseau");
      }
    },
    [form, dispatch],
  );

  // Calcul des totaux pour chaque colonne numérique
  const totals = useMemo(() => {
    return mergedData.reduce(
      (acc, row) => {
        acc.TTC += Number(row.TTC) || 0;
        acc.HT += Number(row.HT) || 0;
        acc.TVA += Number(row.TVA) || 0;
        acc.cbClassique += Number(row.cbClassique) || 0;
        acc.cbSansContact += Number(row.cbSansContact) || 0;
        acc.especes += Number(row.especes) || 0;
        // Total prestaB2B et depenses (somme des montants)
        const prestaB2B =
          (row as { prestaB2B?: { label: string; value: number }[] })
            .prestaB2B ?? [];
        if (Array.isArray(prestaB2B)) {
          acc.prestaB2B += prestaB2B.reduce(
            (s: number, p: { label: string; value: number }) =>
              s + (Number(p.value) || 0),
            0,
          );
        }
        const depenses =
          (row as { depenses?: { label: string; value: number }[] }).depenses ??
          [];
        if (Array.isArray(depenses)) {
          acc.depenses += depenses.reduce(
            (s: number, d: { label: string; value: number }) =>
              s + (Number(d.value) || 0),
            0,
          );
        }
        return acc;
      },
      {
        TTC: 0,
        HT: 0,
        TVA: 0,
        cbClassique: 0,
        cbSansContact: 0,
        especes: 0,
        prestaB2B: 0,
        depenses: 0,
      },
    );
  }, [mergedData]);

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
