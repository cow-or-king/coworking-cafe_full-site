"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { FormCashControl } from "../form/formCashControl";

interface DataTableProps<TData, TValue> {
  columns: any; // You can specify a more precise type if you have one, e.g. ColumnDef<TData, TValue>[]
  data: TData[];
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  formStatus: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingRow: any;
  onDelete?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  form,
  setForm,
  formStatus,
  onSubmit,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any | null>(null);

  const handleOpenForm = (row: any) => {
    setSelectedRow(row);
    // Utiliser la date telle quelle, sans décalage
    let dateStr = row.date || new Date().toISOString().slice(0, 10);
    if (isNaN(new Date(dateStr).getTime())) {
      dateStr = new Date().toISOString().slice(0, 10);
    }

    // Si la ligne n'a pas d'_id (pas de cashEntry), on force _id à ""
    const formId = row._id ? row._id : "";

    setForm((prev: any) => ({
      ...prev,
      _id: formId,
      date: dateStr,
      prestaB2B:
        Array.isArray(row.prestaB2B) && row.prestaB2B.length > 0
          ? row.prestaB2B
          : [{ label: "", value: "" }],
      depenses:
        Array.isArray(row.depenses) && row.depenses.length > 0
          ? row.depenses
          : [{ label: "", value: "" }],
      especes: row.especes ?? "",
      cbClassique: row.cbClassique ?? "",
      cbSansContact: row.cbSansContact ?? "",
    }));
    setOpen(true);
  };

  const handleDeleteRow = (row: any) => {
    // Utiliser l'_id réel de cashentry si présent, sinon la date comme fallback
    const deleteId = row._id || row.date;
    if (!deleteId) {
      alert("Impossible de supprimer : identifiant manquant");
      return;
    }
    // if (window.confirm("Supprimer cette ligne ?")) {
    if (onDelete) onDelete({ ...row, _id: deleteId });
    // }
  };

  React.useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("cash-modal-close", close);
    return () => window.removeEventListener("cash-modal-close", close);
  }, []);

  // Utilitaire pour formater une date en DD-MM-YYYY
  function formatDateDDMMYYYY(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

  // Calcul des totaux pour le footer
  const totals = React.useMemo(() => {
    return data.reduce(
      (acc, row: any) => {
        acc.TTC += Number(row.TTC) || 0;
        acc.HT += Number(row.HT) || 0;
        acc.TVA += Number(row.TVA) || 0;
        // Pour prestaB2B et depenses, on somme les montants si tableau, sinon 0
        if (Array.isArray(row.prestaB2B)) {
          acc.prestaB2B += row.prestaB2B.reduce(
            (s: number, p: any) => s + (Number(p.value) || 0),
            0,
          );
        } else {
          acc.prestaB2B += Number(row.prestaB2B) || 0;
        }
        if (Array.isArray(row.depenses)) {
          acc.depenses += row.depenses.reduce(
            (s: number, d: any) => s + (Number(d.value) || 0),
            0,
          );
        } else {
          acc.depenses += Number(row.depenses) || 0;
        }
        acc.cbClassique += Number(row.cbClassique) || 0;
        acc.cbSansContact += Number(row.cbSansContact) || 0;
        acc.especes += Number(row.especes) || 0;
        // Calcul de la différence
        const ttc = Number(acc.TTC) || 0;
        const add =
          (Number(acc.prestaB2B) || 0) +
          (Number(acc.depenses) || 0) +
          (Number(acc.cbClassique) || 0) +
          (Number(acc.cbSansContact) || 0) +
          (Number(acc.especes) || 0);
        acc.difference = add - ttc;

        return acc;
      },
      {
        TTC: 0,
        HT: 0,
        TVA: 0,
        prestaB2B: 0,
        depenses: 0,
        cbClassique: 0,
        cbSansContact: 0,
        especes: 0,
        difference: 0,
      },
    );
  }, [data]);

  return (
    <div
      className="rounded-md border-2"
      style={{ height: "84dvh", display: "flex", flexDirection: "column" }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>
            {selectedRow?._id ? "Modifier" : "Ajouter"} les données
            {selectedRow?.date
              ? ` du ${formatDateDDMMYYYY(selectedRow.date)}  `
              : ""}
          </DialogTitle>
          {/* Passe ici les props nécessaires à FormCashControl */}
          <FormCashControl
            form={form}
            setForm={setForm}
            formStatus={formStatus}
            onSubmit={onSubmit}
            editingRow={selectedRow}
          />
        </DialogContent>
      </Dialog>
      <div
        className="bg-gray-200"
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table
          className="bg-white"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <TableHeader
            className="bg-gray-200"
            style={{ position: "sticky", top: 0, zIndex: 2 }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                style={{
                  display: "table",
                  width: "100%",
                  tableLayout: "fixed",
                }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-center"
                      key={header.id}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            style={{
              display: "block",
              overflowY: "auto",
              maxHeight: "calc(100% - 50px)", // Ajuste 110px selon la hauteur header/footer
              minHeight: 0,
              width: "100%",
            }}
          >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                // Typage explicite pour accès aux propriétés custom
                const r = row.original as any;
                // Dépenses
                let totalDepenses = 0;
                if (Array.isArray(r.depenses)) {
                  totalDepenses = r.depenses.reduce(
                    (acc: number, d: any) => acc + (Number(d.value) || 0),
                    0,
                  );
                } else if (!isNaN(r.depenses)) {
                  totalDepenses = Number(r.depenses) || 0;
                }
                // PrestaB2B
                let totalPrestaB2B = 0;
                if (Array.isArray(r.prestaB2B)) {
                  totalPrestaB2B = r.prestaB2B.reduce(
                    (acc: number, d: any) => acc + (Number(d.value) || 0),
                    0,
                  );
                } else if (!isNaN(r.prestaB2B)) {
                  totalPrestaB2B = Number(r.prestaB2B) || 0;
                }
                const especes = Number(r.especes) || 0;
                const cbSansContact = Number(r.cbSansContact) || 0;
                const cbClassique = Number(r.cbClassique) || 0;

                // Calcul du total saisi
                // On additionne les dépenses, espèces, CB sans contact et CB classique,
                // puis on soustrait les prestations B2B pour obtenir le total saisi
                const totalSaisie =
                  totalDepenses +
                  especes +
                  cbSansContact +
                  cbClassique -
                  totalPrestaB2B;

                const ttc = Number(r.TTC) || 0;
                // Couleur de fond selon égalité
                const bgColor =
                  ttc === totalSaisie && ttc !== 0
                    ? "#d1fae5" // vert clair
                    : ttc !== 0 && totalSaisie !== 0
                      ? "#fee2e2" // rouge clair
                      : undefined;

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    style={{
                      display: "table",
                      width: "100%",
                      tableLayout: "fixed",
                      background: bgColor,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cell.column.id === "actions"
                          ? flexRender(cell.column.columnDef.cell, {
                              ...cell.getContext(),
                              openForm: (rowData: any) =>
                                handleOpenForm(rowData),
                              onDelete: (rowData: any) =>
                                handleDeleteRow(rowData),
                            })
                          : flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow
                style={{
                  display: "table",
                  width: "100%",
                  height: "100%",
                  tableLayout: "fixed",
                }}
              >
                <TableCell
                  colSpan={columns.length}
                  className="h-[90dvh] text-center"
                >
                  Chargement des données...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* Ligne de total alignée */}
          <tfoot
            className="bg-gray-200"
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 2,
            }}
          >
            <TableRow
              className="font-semibold"
              style={{ display: "table", width: "100%", tableLayout: "fixed" }}
            >
              {table.getAllLeafColumns().map((col, idx) => {
                // Affichage du total selon la colonne
                switch (col.id) {
                  case "date":
                    return (
                      <TableCell key={col.id} className="text-center">
                        Total
                      </TableCell>
                    );
                  case "TTC":
                    return (
                      <TableCell key={col.id} className="text-center">
                        {totals.TTC.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  case "HT":
                    return (
                      <TableCell key={col.id} className="text-center">
                        {totals.HT.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  case "TVA":
                    return (
                      <TableCell key={col.id} className="text-center">
                        {totals.TVA.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  case "prestaB2B":
                    return (
                      <TableCell key={col.id} className="text-center">
                        {totals.prestaB2B.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  case "depenses":
                    return (
                      <TableCell key={col.id} className="text-center">
                        {totals.depenses.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  case "cbClassique":
                    return (
                      <TableCell key={col.id} className="text-center">
                        {totals.cbClassique.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  case "cbSansContact":
                    return (
                      <TableCell key={col.id} className="text-center">
                        {totals.cbSansContact.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  case "especes":
                    return (
                      <TableCell key={col.id} className="text-center">
                        {totals.especes.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  case "difference":
                    return totals.difference < 0 ? (
                      <TableCell
                        key={col.id}
                        className="text-center font-bold text-red-600"
                      >
                        {totals.difference.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    ) : (
                      <TableCell
                        key={col.id}
                        className="text-center font-bold text-green-600"
                      >
                        {totals.difference.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                    );
                  default:
                    return (
                      <TableCell
                        key={col.id}
                        className="text-center"
                      ></TableCell>
                    );
                }
              })}
            </TableRow>
          </tfoot>
        </Table>
      </div>
    </div>
  );
}
