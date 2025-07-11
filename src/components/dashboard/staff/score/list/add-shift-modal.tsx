"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/store/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

interface AddShiftModalProps {
  onShiftAdded: () => void;
}

export function AddShiftModal({ onShiftAdded }: AddShiftModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    staffId: "",
    date: "",
    firstShiftStart: "",
    firstShiftEnd: "",
    secondShiftStart: "",
    secondShiftEnd: "",
  });

  // Récupérer la liste des employés depuis le store Redux
  const staffData = useSelector((state: RootState) => state.staff.data);
  
  // Filtrer pour ne garder que les employés actifs
  const activeStaff = staffData?.filter(staff => staff.active !== false) || [];

  const resetForm = () => {
    setFormData({
      staffId: "",
      date: "",
      firstShiftStart: "",
      firstShiftEnd: "",
      secondShiftStart: "",
      secondShiftEnd: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Trouver les informations de l'employé sélectionné
      const selectedStaff = activeStaff?.find(
        (staff) => staff._id === formData.staffId,
      );
      if (!selectedStaff) {
        toast.error("Employé non trouvé");
        return;
      }

      // Préparer les données pour l'API
      const convertTimeToISO = (timeString: string) => {
        if (!timeString) return "00:00";
        const [hours, minutes] = timeString.split(":");
        const today = new Date();
        today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return today.toISOString();
      };

      const shiftData = {
        staffId: formData.staffId,
        firstName: selectedStaff.firstName,
        lastName: selectedStaff.lastName,
        date: formData.date,
        firstShift: {
          start: formData.firstShiftStart
            ? convertTimeToISO(formData.firstShiftStart)
            : "00:00",
          end: formData.firstShiftEnd
            ? convertTimeToISO(formData.firstShiftEnd)
            : "00:00",
        },
        secondShift: {
          start: formData.secondShiftStart
            ? convertTimeToISO(formData.secondShiftStart)
            : "00:00",
          end: formData.secondShiftEnd
            ? convertTimeToISO(formData.secondShiftEnd)
            : "00:00",
        },
      };

      const response = await fetch("/api/shift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shiftData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création du pointage",
        );
      }

      toast.success("Pointage ajouté avec succès");
      resetForm();
      setOpen(false);
      onShiftAdded(); // Callback pour rafraîchir les données
    } catch (error: any) {
      console.error("Erreur lors de la création du pointage:", error);
      toast.error(error.message || "Erreur lors de la création du pointage");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un pointage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un pointage</DialogTitle>
          <DialogDescription>
            Créer un nouveau pointage pour un employé à une date donnée.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff">Employé</Label>
              <Select
                value={formData.staffId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, staffId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Sélectionner un employé (${activeStaff.length} actifs)`} />
                </SelectTrigger>
                <SelectContent>
                  {activeStaff?.map((staff) => (
                    <SelectItem key={staff._id} value={staff._id}>
                      {staff.firstName} {staff.lastName}
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Premier Shift</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstShiftStart">Début</Label>
                <Input
                  id="firstShiftStart"
                  type="time"
                  value={formData.firstShiftStart}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstShiftStart: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstShiftEnd">Fin</Label>
                <Input
                  id="firstShiftEnd"
                  type="time"
                  value={formData.firstShiftEnd}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstShiftEnd: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Deuxième Shift</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondShiftStart">Début</Label>
                <Input
                  id="secondShiftStart"
                  type="time"
                  value={formData.secondShiftStart}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secondShiftStart: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondShiftEnd">Fin</Label>
                <Input
                  id="secondShiftEnd"
                  type="time"
                  value={formData.secondShiftEnd}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secondShiftEnd: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.staffId || !formData.date}
            >
              {isLoading ? "Création..." : "Créer le pointage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
