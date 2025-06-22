"use client";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getYears = (data: any[]) => {
  const years = data.map((item) => new Date(item.date).getFullYear());
  return Array.from(new Set(years)).sort((a, b) => b - a);
};

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
  const [editingRow, setEditingRow] = useState<any | null>(null);
  console.log("CashControl: editingRow", editingRow);

  const [data, setData] = useState<any[]>([]);
  const [sortedData, setSortedData] = useState<any[]>([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    currentMonth,
  );

  const [selectedRow, setSelectedRow] = React.useState<any | null>(null);

  const [form, setForm] = useState({
    _id: "",
    date: "",
    depenses: [{ label: "", value: "" }], // tableau d'objets pour plusieurs dépenses
    especes: "",
    cbClassique: "",
    cbSansContact: "",
  });
  const [formStatus, setFormStatus] = useState<string | null>(null);

  // Callbacks pour actions
  const handleEdit = (row: any) => {
    setEditingRow(row);
    // Correction du format pour l'input date
    let dateStr = row.date || "";
    if (dateStr.includes("/")) {
      // Convertit 2025/06/06 en 2025-06-06
      dateStr = dateStr.replaceAll("/", "-");
    }
    setForm((prev) => ({
      ...prev,
      _id: row._id || "",
      date: dateStr,
      depenses:
        Array.isArray(row.depenses) && row.depenses.length > 0
          ? row.depenses
          : [{ label: "", value: "" }],
      especes: row.especes ?? "",
      cbClassique: row["cb-classique"] ?? "",
      cbSansContact: row["cb-sans-contact"] ?? "",
    }));
  };
  const handleDelete = async (row: any) => {
    // console.log(row);

    if (!window.confirm("Supprimer cette ligne ?")) return;
    if (!row._id) {
      alert("Impossible de supprimer : identifiant manquant");
      return;
    }
    await fetch(`/api/dashboard/cash-entry/delete?id=${row._id}`, {
      method: "DELETE",
    });
    fetchCashEntries();
    fetchItems();
  };

  useEffect(() => {
    const onEdit = (e: any) => handleEdit(e.detail);
    const onDelete = (e: any) => handleDelete(e.detail);
    window.addEventListener("cash-edit", onEdit);
    window.addEventListener("cash-delete", onDelete);
    return () => {
      window.removeEventListener("cash-edit", onEdit);
      window.removeEventListener("cash-delete", onDelete);
    };
  }, []);

  useEffect(() => {
    fetchItems();
    fetchCashEntries();
  }, []);

  const [cashEntries, setCashEntries] = useState<any[]>([]);

  const fetchCashEntries = async () => {
    const res = await fetch("/api/dashboard/cash-entry/get");
    const data = await res.json();
    // console.log(data.data[0].date);

    setCashEntries(data.data);
  };

  const fetchItems = async () => {
    const res = await fetch("/api/dashboard/turnover");
    const data = await res.json();
    setData(data.data);
  };

  const years = getYears(data);

  useEffect(() => {
    if (data && data.length > 0) {
      let filtered = [...data];
      if (selectedYear) {
        filtered = filtered.filter(
          (item) => new Date(item.date).getFullYear() === selectedYear,
        );
      }
      if (selectedMonth !== null) {
        filtered = filtered.filter(
          (item) => new Date(item.date).getMonth() === selectedMonth,
        );
      }
      // Fusionne les cashEntries sur la même date
      const merged = filtered.map((item) => {
        const entry = cashEntries.find(
          (e) =>
            e.date &&
            (() => {
              const d = new Date(e.date);
              d.setDate(d.getDate() - 1);
              return d.toISOString().slice(0, 10);
            })() === new Date(item.date).toISOString().slice(0, 10),
        );

        return entry
          ? {
              ...item,
              _id: entry._id, // <-- on ajoute l'id de cashEntries pour la suppression
              depenses: entry.depenses,
              especes: entry.especes,
              "cb-classique": entry.cbClassique,
              "cb-sans-contact": entry.cbSansContact,
            }
          : item;
      });
      const sorted = merged.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setSortedData(sorted);
    }
  }, [data, selectedYear, selectedMonth, cashEntries]);

  return (
    <div className="container mx-auto py-10">
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
        editingRow={editingRow}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        form={form}
        setForm={setForm}
        formStatus={formStatus}
        onSubmit={async (e) => {
          e.preventDefault();
          setFormStatus(null);
          try {
            // Normalisation du format de la date (YYYY-MM-DD)
            let dateToSend = form.date;
            if (dateToSend.includes("/")) {
              dateToSend = dateToSend.replaceAll("/", "-");
            }
            // Si la date n'est pas au format ISO, on tente de la convertir
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateToSend)) {
              const d = new Date(dateToSend);
              if (!isNaN(d.getTime())) {
                dateToSend = d.toISOString().slice(0, 10);
              }
            }
            let bodyData: any = {
              date: dateToSend,
              depenses: form.depenses
                .filter(
                  (d) => d.label && d.value !== "" && !isNaN(Number(d.value)),
                )
                .map((d) => ({ label: d.label, value: Number(d.value) })),
              especes: form.especes !== "" ? Number(form.especes) : undefined,
              cbClassique:
                form.cbClassique !== "" ? Number(form.cbClassique) : undefined,
              cbSansContact:
                form.cbSansContact !== ""
                  ? Number(form.cbSansContact)
                  : undefined,
            };
            if (editingRow && editingRow._id) {
              bodyData.id = editingRow._id;
            }
            const res = await fetch(
              editingRow?._id
                ? "/api/dashboard/cash-entry/update"
                : "/api/dashboard/cash-entry",
              {
                method: editingRow ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
              },
            );
            const result = await res.json();
            if (result.success) {
              // Message de statut approprié selon l'action
              const actionType = editingRow?._id
                ? "Modification"
                : selectedRow
                  ? "Saisie"
                  : "Ajout";
              setFormStatus(`${actionType} réussi !`);

              // Mise à jour immédiate des données locales
              setCashEntries((prev) => {
                if (editingRow && editingRow._id) {
                  // Pour une modification, on remplace l'entrée existante
                  return prev.map((entry) =>
                    entry._id === editingRow._id ? result.data : entry,
                  );
                } else {
                  // Pour une nouvelle entrée, on l'ajoute au tableau
                  return [...prev, result.data];
                }
              });

              // Réinitialisation du formulaire
              setForm({
                _id: "",
                date: "",
                depenses: [{ label: "", value: "" }],
                especes: "",
                cbClassique: "",
                cbSansContact: "",
              });
              setEditingRow(null);

              // Rafraîchissement des données
              fetchItems();
            } else {
              setFormStatus(
                "Erreur : " + (result.error || "Impossible d'enregistrer"),
              );
            }
          } catch (err) {
            setFormStatus("Erreur réseau");
          }
        }}
        columns={columns}
        data={sortedData.slice().sort((a, b) => {
          // Tri du 1 au 31 (ordre croissant sur le jour du mois)
          const dayA = a.date ? new Date(a.date).getDate() : 0;
          const dayB = b.date ? new Date(b.date).getDate() : 0;
          return dayA - dayB;
        })}
      />
    </div>
  );
}
