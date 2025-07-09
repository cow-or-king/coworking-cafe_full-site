"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react"; // Importer useState pour gérer l'état du filtre

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData extends { active: boolean }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<
  TData extends {
    id: string; // Ajout de la propriété id
    startTime: string;
    endTime?: string; // Ajout de la propriété endTime
    active: boolean;
    firstName: string; // Ajout de la propriété firstName
    lastName: string; // Ajout de la propriété lastName
  },
  TValue,
>({
  columns,

  data = [], // Ajout d'une valeur par défaut pour éviter les erreurs
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // console.log("DataTable data:", data);
  const formatTime = (time: string) => {
    if (!time) return "00:00"; // Retourner 00:00 si la chaîne est vide
    const date = new Date(time);
    if (isNaN(date.getTime())) return "Pointage manquant"; // Retourner 00:00 si la date est invalide
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  interface GroupedRow {
    startTimeFirst: string;
    startTimeSecond: string;
    [key: string]: any;
  }

  const groupedData: Record<string, GroupedRow> = data.reduce(
    (acc, row) => {
      const key = `${row.firstName}-${row.lastName}-${new Date(
        row.startTime,
      ).toDateString()}`; // Clé unique par utilisateur et date
      console.log(`Clé générée : ${key}`); // Log pour vérifier les clés
      if (!acc[key]) {
        acc[key] = {
          id: row.id, // Utilisation de l'ID pour identifier la ligne
          date: new Date(row.startTime).toLocaleDateString("fr-FR"), // Formater la date en DD/MM/YYYY
          firstName: row.firstName, // Prénom de l'utilisateur
          lastName: row.lastName, // Nom de l'utilisateur
          startTimeFirst: row.startTime,
          endTimeFirst: row.endTime,
          startTimeSecond: "",
          endTimeSecond: "",
        };
      } else {
        if (!acc[key].startTimeSecond) {
          acc[key].startTimeSecond = row.startTime;
          acc[key].endTimeSecond = row.endTime;
        } else {
          console.warn(`Plus de deux entrées pour la clé ${key}`);
        }
      }
      return acc;
    },
    {} as Record<string, GroupedRow>,
  );

  const formattedData = Object.values(groupedData).map((row, index) => {
    return {
      id: row.id || `row-${index}`, // Ajout d'un id unique si absent
      ...row,
      startTimeFirst: row.startTimeFirst ? formatTime(row.startTimeFirst) : "",
      endTimeFirst: row.endTimeFirst ? formatTime(row.endTimeFirst) : "",
      startTimeSecond: row.startTimeSecond
        ? formatTime(row.startTimeSecond)
        : "",
      endTimeSecond: row.endTimeSecond ? formatTime(row.endTimeSecond) : "",
      firstName: row.firstName, // Ajout du prénom dans les données formatées
      lastName: row.lastName, // Ajout du nom dans les données formatées
    };
  });

  console.log("Données regroupées:", groupedData);
  console.log("Données formatées:", formattedData);

  const [selectedUser, setSelectedUser] = useState<string | null>(null); // État pour l'utilisateur sélectionné

  const uniqueUsers = Array.from(
    new Set(data.map((row) => `${row.firstName} ${row.lastName}`)),
  ); // Extraire les utilisateurs uniques

  const filteredData = selectedUser
    ? formattedData.filter(
        (row) => `${row.firstName} ${row.lastName}` === selectedUser,
      )
    : formattedData; // Filtrer les données formatées si un utilisateur est sélectionné

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value || null); // Mettre à jour l'utilisateur sélectionné
  };

  // console.log("DataTable data:", data);
  // console.log("Formatted time:", formatTime(data[0].startTime || "12:34"));

  return (
    <div>
      <div className="py-6">
        <label htmlFor="user-filter" className="mb-2 block text-sm font-medium">
          Filtrer par utilisateur :
        </label>
        <select
          id="user-filter"
          className="block w-full rounded-md border p-2"
          value={selectedUser || ""}
          onChange={handleUserChange}
        >
          <option value="">Tous les utilisateurs</option>
          {uniqueUsers.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
          {filteredData.length ? (
            filteredData.map(
              (row) => (
                console.log("Row data:", row),
                (
                  <TableRow key={row.id} data-state={undefined}>
                    {columns.map(
                      (column) => (
                        console.log("Column data:", column),
                        (
                          <TableCell key={column.id}>
                            {
                              row[
                                column.id as
                                  | "startTimeFirst"
                                  | "endTimeFirst"
                                  | "startTimeSecond"
                                  | "endTimeSecond"
                                  | "id"
                              ]
                            }
                          </TableCell>
                        )
                      ),
                    )}
                  </TableRow>
                )
              ),
            )
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
