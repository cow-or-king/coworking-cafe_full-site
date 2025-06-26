"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  tel: string;
};

export const columns: ColumnDef<Staff>[] = [
  {
    id: "firstName",
    header: "Nom",
    accessorKey: "firstName",
  },
  {
    id: "lastName",
    header: "Prénom",
    accessorKey: "lastName",
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "tel",
    header: "Téléphone",
    accessorKey: "tel",
  },

  {
    id: "actions",
    cell: () => {
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              Fiche de salaire
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Avenant</DropdownMenuItem>
            <DropdownMenuItem>Avenant Temporaire</DropdownMenuItem>
            <DropdownMenu>
              <DropdownMenuItem variant="destructive">
                <AlertDialog>
                  <AlertDialogTrigger>Fin de contrat</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous absolument sûr ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera
                        définitivement votre compte et supprimera vos données de
                        nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer rounded-md px-4 py-2 text-red-500 transition-colors duration-200 hover:bg-red-600 hover:text-white">
                        <div
                          onClick={() => router.prefetch("/dashboard/staff")}
                        >
                          Annuler
                        </div>
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className={cn(
                          "bg-(--chart-5) text-white hover:bg-(--chart-4)",
                        )}
                      >
                        <Link href="/dashboard/staff/new">Continuer</Link>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
