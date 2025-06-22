"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { FormCashControl } from "@/components/admin/dashboard/accounting/cash-control/form/formCashControl";
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  formStatus: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingRow: any;
  selectedRow: any;
  setSelectedRow: React.Dispatch<React.SetStateAction<any>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  form,
  setForm,
  formStatus,
  onSubmit,
  selectedRow,
  setSelectedRow,
  editingRow, // Ajout de la prop editingRow
}: DataTableProps<TData, TValue>): React.JSX.Element {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [open, setOpen] = React.useState(false);
  // const [selectedRow, setSelectedRow] = React.useState<any | null>(null);

  const handleOpenForm = (row: any) => {
    setSelectedRow(row);
    // S'assurer que nous avons une date valide
    let dateStr = row.date || new Date().toISOString().slice(0, 10);
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      dateStr = new Date().toISOString().slice(0, 10);
    } else {
      // Soustrait un jour à la date
      d.setDate(d.getDate() + 1);
      dateStr = d.toISOString().slice(0, 10);
    }

    // Lors de la modification, utiliser l'ID existant, sinon rien
    const formId = row._id || "";

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

  return (
    <div className="rounded-md border">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>
            {editingRow?._id ? "Modifier" : "Ajouter"} les données
            {selectedRow?.date ? ` du ${selectedRow.date}` : ""}
          </DialogTitle>
          {/* Passe ici les props nécessaires à FormCashControl */}
          <FormCashControl
            form={form}
            setForm={setForm}
            formStatus={formStatus}
            onSubmit={onSubmit}
            editingRow={selectedRow}
            e={editingRow?._id}
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
