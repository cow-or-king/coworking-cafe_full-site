"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  _id: string;
  id: number;
  date: string;
  TTC: number;
  HT: number;
  TVA: number;
  "ca-ht": number | { 20: number; 10: number; "5,5": number };
  "ca-tva": number | { 20: number; 10: number; "5,5": number }; // Assuming tva can be a number or an object with different rates
  depenses: number;
  cbClassique: number;
  cbSansContact: number;
  especes: number;
  total: number;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.date;
      if (!date) return "";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },
  {
    accessorKey: "TTC",
    header: "Total TTC",
    cell: ({ row }) => {
      const ttc = row.original.TTC;
      if (ttc === null || ttc === undefined || isNaN(ttc)) return "";
      return `${ttc.toFixed(2)} €`;
    },
  },
  {
    accessorKey: "HT",
    header: "Total HT",
    cell: ({ row }) => {
      const ht = row.original.HT;
      if (ht === null || ht === undefined || isNaN(ht)) return "";
      return `${ht.toFixed(2)} €`;
    },
  },
  {
    accessorKey: "TVA",
    header: "Total TVA",
    cell: ({ row }) => {
      const tva = row.original.TVA;
      if (tva === null || tva === undefined || isNaN(tva)) return "";
      return `${tva.toFixed(2)} €`;
    },
  },
  {
    accessorKey: "ca-ht",
    header: "HT",
    cell: ({ row }) => {
      const ht = row.original["ca-ht"];
      if (typeof ht === "object" && ht !== null) {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.2rem",
            }}
          >
            {Object.entries(ht)
              .filter(([, value]) => value !== null && value !== undefined)
              .sort(
                ([a], [b]) =>
                  parseFloat(a.replace(",", ".")) -
                  parseFloat(b.replace(",", ".")),
              )
              .map(([key, value]) => (
                <div className="flex min-w-24 gap-1" key={key}>
                  <span
                    style={{
                      minWidth: 50,
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    {key} % :
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      minWidth: 70,
                      textAlign: "right",
                    }}
                  >
                    {typeof value === "number" ? value.toFixed(2) : value} €
                  </span>
                </div>
              ))}
          </div>
        );
      }
      return ht === null || ht === undefined ? "" : `${ht.toFixed(2)} €`;
    },
  },
  {
    accessorKey: "ca-tva", // Assuming tva is an object with keys for different rates
    header: "TVA",
    cell: ({ row }) => {
      const tva = row.original["ca-tva"];
      if (typeof tva === "object" && tva !== null) {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.2rem",
            }}
          >
            {Object.entries(tva)
              .filter(([, value]) => value !== null && value !== undefined)
              .sort(
                ([a], [b]) =>
                  parseFloat(a.replace(",", ".")) -
                  parseFloat(b.replace(",", ".")),
              )
              .map(([key, value]) => (
                <div className="flex min-w-24 gap-1" key={key}>
                  <span
                    style={{
                      minWidth: 50,
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    {key} % :
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      minWidth: 60,
                      textAlign: "right",
                    }}
                  >
                    {typeof value === "number" ? value.toFixed(2) : value} €
                  </span>
                </div>
              ))}
          </div>
        );
      }
      return tva === null || tva === undefined ? "" : `${tva.toFixed(2)} €`;
    },
  },

  {
    accessorKey: "depenses",
    header: "Dépenses",
    cell: ({ row }) => {
      const depenses = row.original.depenses;
      if (Array.isArray(depenses) && depenses.length > 0) {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.2rem",
            }}
          >
            {depenses
              .filter(
                (d: any) =>
                  d.label && d.value !== undefined && d.value !== null,
              )
              .map((d: any, idx: number) => (
                <div className="flex min-w-24 gap-1" key={idx}>
                  <span
                    style={{
                      minWidth: 50,
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    {d.label} :
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      minWidth: 60,
                      textAlign: "right",
                    }}
                  >
                    {Number(d.value).toFixed(2)} €
                  </span>
                </div>
              ))}
          </div>
        );
      }
      return depenses === null || depenses === undefined ? "" : depenses;
    },
  },

  {
    accessorKey: "cbClassique",
    header: "CB classique",
  },
  {
    accessorKey: "cbSansContact",
    header: "CB sans contact",
  },

  {
    accessorKey: "especes",
    header: "Espèces",
  },
  {
    id: "actions",
    accessorFn: (row) => row._id,
    cell: (cell: any) => {
      const { row, openForm, onDelete } = cell;
      // Ouvre le formulaire avec la date de la ligne
      const handleOpenFormWithDate = () => {
        if (typeof openForm === "function") {
          openForm({ ...row.original, date: row.original.date });
        }
      };
      // Pour une nouvelle ligne sans données
      const isEmpty =
        (!row.original.especes || row.original.especes === 0) &&
        (!row.original.depenses || row.original.depenses.length === 0) &&
        (!row.original.cbClassique || row.original.cbClassique === 0) &&
        (!row.original.cbSansContact || row.original.cbSansContact === 0);
      const sameDate =
        row.original._id && row.original.date === row.original._id;
      if (isEmpty) {
        return (
          <Button
            onClick={handleOpenFormWithDate}
            variant="outline"
            className="border-green-400 text-green-600 hover:bg-green-50"
          >
            Saisir
          </Button>
        );
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpenFormWithDate}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete && onDelete(row.original)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
