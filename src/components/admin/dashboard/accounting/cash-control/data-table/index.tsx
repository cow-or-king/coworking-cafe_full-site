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
  console.log("data-table 49", selectedRow);

  const handleOpenForm = (row: any) => {
    setSelectedRow(row);
    // Utiliser la date telle quelle, sans décalage
    let dateStr = row.date || new Date().toISOString().slice(0, 10);
    if (isNaN(new Date(dateStr).getTime())) {
      dateStr = new Date().toISOString().slice(0, 10);
    }

    // Utiliser l'_id réel de cashentry si présent, sinon la date comme fallback
    const formId = row._id || row.date || "";
    console.log("formId", row._id, row.date, formId);

    setForm((prev: any) => ({
      ...prev,
      _id: formId,
      date: dateStr,
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
    if (window.confirm("Supprimer cette ligne ?")) {
      if (onDelete) onDelete({ ...row, _id: deleteId });
    }
  };

  React.useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("cash-modal-close", close);
    return () => window.removeEventListener("cash-modal-close", close);
  }, []);

  return (
    <div className="rounded-md border">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>
            {selectedRow?._id ? "Modifier" : "Ajouter"} les données
            {selectedRow?.date ? ` du ${selectedRow.date}` : ""}
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
      <Table>
        <TableHeader className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="text-center" key={header.id}>
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
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "actions"
                      ? flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                          openForm: (rowData: any) => handleOpenForm(rowData),
                          onDelete: (rowData: any) => handleDeleteRow(rowData),
                        })
                      : flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
