"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import Link from "next/link";

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
    cell: ({ row }) => {
      const router = useRouter();
      const [formData, setFormData] = useState(row.original);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Envoyer les données mises à jour à l'API
        fetch(`/api/staff/put`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }).then((res) => res.json());
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenu>
              <DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger>Modifier</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mo</AlertDialogTitle>
                    </AlertDialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium">Nom</label>
                        <input
                          name="firstName"
                          type="text"
                          className="w-full rounded border p-2"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Prénom
                        </label>
                        <input
                          name="lastName"
                          type="text"
                          className="w-full rounded border p-2"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          className="w-full rounded border p-2"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Téléphone
                        </label>
                        <input
                          name="tel"
                          type="text"
                          className="w-full rounded border p-2"
                          value={formData.tel}
                          onChange={handleChange}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => router.back()}>
                          Annuler
                        </AlertDialogCancel>
                        <button
                          type="submit"
                          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          onClick={() => router.back()}
                        >
                          Enregistrer
                        </button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenu>

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
                        Etes-vous sûr de vouloir mettre fin au contrat ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera
                        définitivement votre compte et supprimera vos données de
                        nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => router.back()}>
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction>
                        <Link href="/dashboard/staff/">Continuer</Link>
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
