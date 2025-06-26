"use client";
import { columns } from "@/components/dashboard/staff/list/columns";
import { DataTable } from "@/components/dashboard/staff/list/data-table";
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
import { cn } from "@/lib/utils";
import { StaffApi } from "@/store/staff";
import { useTypedDispatch, useTypedSelector } from "@/store/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ListPage() {
  const router = useRouter();

  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(StaffApi.fetchData()).then(console.log);
  }, [dispatch]);

  const data = useTypedSelector((state) => state.staff.data);
  // console.log("Staff data:", data);

  return (
    <div className="container mx-auto px-4">
      <div className="flex py-6">
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
                    router.push("/list/create");
                  }}
                >
                  Continuer
                </div>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
