"use client";

import { useRouter } from "next/navigation";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Dialog, DialogDescription } from "@radix-ui/react-dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const router = useRouter();

  return (
    <div>
      <div className="flex py-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className={cn("bg-(--chart-5) text-white hover:bg-(--chart-4)")}
            >
              Créer nouvel employé
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Vous êtes sur le point de créer un nouvel employé
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cette action prendra quelques minutes, veuillez suivre les
                étapes et valider chacunes d'entre elles.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className={cn("bg-(--chart-5) text-white hover:bg-(--chart-4)")}
              >
                <div
                  onClick={() => {
                    router.push("/list/new");
                  }}
                >
                  Continuer
                </div>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="rounded-md border">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Dialog key={row.id} modal>
                  <DialogTrigger asChild>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[720px]">
                    <DialogTitle>Employé</DialogTitle>
                    <DialogDescription>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="nom">Nom</label>
                            <input
                              type="text"
                              id="nom"
                              defaultValue={row.original.nom}
                              className="w-full border p-2"
                            />
                          </div>
                          <div>
                            <label htmlFor="prenom">Prénom</label>
                            <input
                              type="text"
                              id="prenom"
                              defaultValue={row.original.prénom}
                              className="w-full border p-2"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              id="email"
                              defaultValue={row.original.email}
                              className="w-full border p-2"
                            />
                          </div>
                          <div>
                            <label htmlFor="tel">Téléphone</label>
                            <input
                              type="tel"
                              id="tel"
                              defaultValue={row.original.tel}
                              className="w-full border p-2"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="numberSecu">Numéro de sécurité</label>
                          <input
                            type="text"
                            id="numberSecu"
                            className="w-full border p-2"
                          />
                        </div>
                      </div>
                    </DialogDescription>

                    <div className="flex justify-between space-x-2">
                      <DialogClose asChild>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            console.log("Delete");
                          }}
                        >
                          Supprimer
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="default"
                          onClick={() => {
                            console.log("Modifier");
                          }}
                        >
                          Modifier
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            console.log("Fermer");
                          }}
                        >
                          Fermer
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
