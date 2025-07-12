"use client";
import { columns } from "@/components/dashboard/staff/list/columns";
import { DataTable } from "@/components/dashboard/staff/list/data-table";
import SwitchWithText from "@/components/dashboard/switchWithText";
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
import { useEffect, useState } from "react";

export default function ListPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(true);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(StaffApi.fetchData());
  }, [dispatch]);
  // useEffect(() => {
  //   dispatch(StaffApi.fetchData()).then(console.log);
  // }, [dispatch]);

  const data = useTypedSelector((state) => state.staff.data);
  // console.log("Staff data:", data);

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between py-6">
        <div>
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
                  className={cn(
                    "bg-(--chart-5) text-white hover:bg-(--chart-4)",
                  )}
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
        <div className="flex justify-end px-8 pt-2">
          <SwitchWithText
            checked={checked}
            setChecked={setChecked}
            firstText="INACTIF"
            secondText="ACTIF"
          />
        </div>
      </div>
      <DataTable columns={columns} data={data || []} checked={checked} />
    </div>
  );
}
