import { Button } from "@/components/ui/button";
import React from "react";

interface Depense {
  label: string;
  value: string | number;
}

interface FormCashControlProps {
  form: {
    _id: string;
    date: string;
    depenses: Depense[];
    especes: string | number;
    cbClassique: string | number;
    cbSansContact: string | number;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  formStatus: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingRow: any;
}

export function FormCashControl({
  form,
  setForm,
  formStatus,
  editingRow,
  onSubmit,
}: FormCashControlProps) {
  return (
    <form
      className="mb-8 flex flex-wrap items-end gap-4 rounded border bg-gray-50 p-4"
      onSubmit={onSubmit}
    >
      {/* <input
        type="date"
        className="rounded border px-2 py-1"
        value={form.date}
        onChange={(e) => setForm((f: any) => ({ ...f, date: e.target.value }))}
        required
      /> */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold">Dépenses :</span>
        {form.depenses.map((dep: Depense, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              className="rounded border px-2 py-1"
              placeholder="Libellé"
              value={dep.label}
              onChange={(e) =>
                setForm((f: any) => ({
                  ...f,
                  depenses: f.depenses.map((d: Depense, i: number) =>
                    i === idx ? { ...d, label: e.target.value } : d,
                  ),
                }))
              }
            />
            <input
              type="number"
              className="rounded border px-2 py-1"
              placeholder="Montant"
              value={dep.value}
              onChange={(e) =>
                setForm((f: any) => ({
                  ...f,
                  depenses: f.depenses.map((d: Depense, i: number) =>
                    i === idx ? { ...d, value: e.target.value } : d,
                  ),
                }))
              }
            />
            <button
              type="button"
              className="font-bold text-red-500"
              onClick={() =>
                setForm((f: any) => ({
                  ...f,
                  depenses: f.depenses.filter((_: any, i: number) => i !== idx),
                }))
              }
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          className="mt-1 text-sm text-blue-500 underline"
          onClick={() =>
            setForm((f: any) => ({
              ...f,
              depenses: [...f.depenses, { label: "", value: "" }],
            }))
          }
        >
          + Ajouter une dépense
        </button>
      </div>
      <input
        type="number"
        className="rounded border px-2 py-1"
        placeholder="Espèces"
        value={form.especes}
        onChange={(e) =>
          setForm((f: any) => ({ ...f, especes: e.target.value }))
        }
      />
      <input
        type="number"
        className="rounded border px-2 py-1"
        placeholder="CB classique"
        value={form.cbClassique}
        onChange={(e) =>
          setForm((f: any) => ({ ...f, cbClassique: e.target.value }))
        }
      />
      <input
        type="number"
        className="rounded border px-2 py-1"
        placeholder="CB sans contact"
        value={form.cbSansContact}
        onChange={(e) =>
          setForm((f: any) => ({ ...f, cbSansContact: e.target.value }))
        }
      />
      <Button
        type="submit"
        className="bg-(--chart-5) text-white hover:bg-(--chart-4)"
      >
        {editingRow
          ? editingRow._id && editingRow.date === editingRow._id
            ? "Saisir"
            : "Modifier"
          : "Ajouter"}
      </Button>
      {formStatus && (
        <span className="ml-4 text-sm font-semibold">{formStatus}</span>
      )}
    </form>
  );
}
