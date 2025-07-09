import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as React from "react";
import toast from "react-hot-toast";
import StaffCardFooter from "./staffCardFooter";
import StaffCardHeader from "./staffCardHeader";

type StaffCardProps = {
  firstname: string;
  lastname: string;
  start: string;
  end: string;
  staffId: string; // Ajout de l'ID du staff
  mdp: number; // Mot de passe pour le pointage
  hidden: string; // Propriété pour gérer la visibilité du footer
};

export default function StaffCard({
  firstname,
  lastname,
  start,
  end,
  staffId,
  mdp,
  hidden, // Ajout de la propriété hidden avec une valeur par défaut
}: StaffCardProps) {
  const [form, setForm] = React.useState({
    date: new Date().toISOString().slice(0, 10),
    firstname: firstname || "",
    lastname: lastname || "",
    start: start || "",
    end: end || "",
    staffId: staffId || "", // Utilisation de l'ID réel du staff
    hidden: hidden || "", // Utilisation de la propriété hidden
  });

  const [timer, setTimer] = React.useState<boolean | null>(false);
  const [startTime, setStartTime] = React.useState<string | null>(null);
  const [endTime, setEndTime] = React.useState<string | null>(null);
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [passwordPrompt, setPasswordPrompt] = React.useState(false);
  const [shiftId, setShiftId] = React.useState<string | null>(null); // État pour stocker l'_id du shift

  const formatTime = (isoString: string | null) => {
    if (!isoString || isNaN(Date.parse(isoString))) return ""; // Retourner une chaîne vide si la date est invalide
    const date = new Date(isoString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  React.useEffect(() => {
    const fetchCurrentShift = async () => {
      try {
        const response = await fetch(
          `/api/shift?staffId=${staffId}&date=${form.date}`,
        );
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération du pointage en cours.",
          );
        }

        const result = await response.json();
        console.log("Réponse brute de l'API GET /api/shift :", result);

        if (result.shifts && result.shifts.length > 0) {
          const today = new Date(form.date).toISOString().slice(0, 10);
          const ongoingShift = result.shifts.find(
            (shift: { endTime: string; date: string }) =>
              shift.endTime === "00:00" && shift.date === today,
          );
          if (ongoingShift) {
            console.log(
              "Pointage en cours récupéré pour aujourd'hui :",
              ongoingShift,
            );
            setShiftId(ongoingShift._id);
            setStartTime(ongoingShift.startTime);
            setTimer(true);
          } else {
            console.log("Aucun pointage en cours trouvé pour aujourd'hui.");
            setShiftId(null);
            setStartTime(null);
            setTimer(false);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du pointage en cours :",
          error,
        );
      }
    };

    fetchCurrentShift();
  }, [staffId, form.date]);

  const checkShiftLimit = async () => {
    try {
      const response = await fetch(
        `/api/shift?staffId=${staffId}&date=${form.date}`,
      );
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la vérification des pointages existants.",
        );
      }

      const result = await response.json();
      if (result.shifts && result.shifts.length >= 2) {
        toast.error("Limite de 2 pointages atteinte pour aujourd'hui.");
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification des pointages existants :",
        error,
      );
      toast.error("Erreur lors de la vérification des pointages existants.");
      return false;
    }
  };

  const handleCardClick = async () => {
    if (isBlocked) return;

    if (!timer) {
      const canStart = await checkShiftLimit();
      if (!canStart) return;

      const now = new Date().toISOString();
      setStartTime(now);
      setTimer(true);
      toast.success("Pointage démarré à " + formatTime(now));

      const shiftData = {
        staffId,
        firstName: firstname,
        lastName: lastname,
        date: form.date,
        startTime: now,
        endTime: "00:00",
      };

      try {
        const response = await fetch("/api/shift", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shiftData),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'enregistrement du pointage.");
        }

        const result = await response.json();
        if (result && result.shift && result.shift._id) {
          setShiftId(result.shift._id);
        } else {
          console.error("Erreur : _id non retourné par l'API POST.");
          toast.error("Erreur lors de l'enregistrement du pointage.");
        }
      } catch (error) {
        console.error("Erreur lors de la requête à l'API:", error);
        toast.error("Erreur lors de l'enregistrement du pointage.");
      }
    } else {
      const now = new Date().toISOString();
      setEndTime(now);
      setTimer(false);
      toast.success("Pointage arrêté à " + formatTime(now));

      const updateData = {
        _id: shiftId,
        endTime: now,
      };

      try {
        if (!shiftId) {
          console.error("Erreur : shiftId est null ou undefined.");
          toast.error(
            "Impossible de mettre à jour le pointage. Veuillez réessayer.",
          );
          return;
        }

        const response = await fetch(`/api/shift`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du pointage.");
        }

        const result = await response.json();
        console.log("Pointage mis à jour :", result);
      } catch (error) {
        console.error("Erreur lors de la requête à l'API:", error);
        toast.error("Erreur lors de la mise à jour du pointage.");
      }

      setIsBlocked(true);

      setTimeout(() => {
        setIsBlocked(false);
        window.location.reload();
      }, 10000);
    }
  };

  const handlePasswordSubmit = (password: number) => {
    if (password === mdp) {
      setPasswordPrompt(false);
      handleCardClick();
    } else {
      toast.error("Mot de passe incorrect.");
    }
  };

  const handleCardClickWithPassword = () => {
    if (isBlocked) return; // Bloquer le clic si isBlocked est vrai

    setPasswordPrompt(true); // Afficher la demande de mot de passe
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPasswordPrompt(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    console.log("shiftId mis à jour :", shiftId);
  }, [shiftId]);

  React.useEffect(() => {
    console.log("timer mis à jour :", timer);
  }, [timer]);

  React.useEffect(() => {
    console.log("startTime mis à jour :", startTime);
  }, [startTime]);

  React.useEffect(() => {
    if (passwordPrompt) {
      setTimeout(() => {
        const input = document.querySelector(
          ".password-modal input",
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 0); // Utilisation de setTimeout pour garantir que l'élément est monté
    }
  }, [passwordPrompt]);

  return (
    <>
      {passwordPrompt && (
        <div
          className="password-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => setPasswordPrompt(false)}
        >
          <AlertDialog open={passwordPrompt} onOpenChange={setPasswordPrompt}>
            <AlertDialogContent
              className="password-modal"
              style={{
                position: "fixed",
                width: "300px",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                zIndex: 1000,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Pointage de {firstname} {lastname}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <input
                    type="password"
                    placeholder="Entrez le mot de passe"
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      padding: "10px",
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handlePasswordSubmit(Number(e.currentTarget.value));
                      } else if (e.key === "Escape") {
                        setPasswordPrompt(false); // Fermer le modal sur Échap
                      }
                    }}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  className={cn(
                    "cursor-pointer bg-(--chart-5) hover:bg-(--chart-4)",
                  )}
                >
                  <div
                    onClick={() => {
                      const input = document.querySelector(
                        ".password-modal input",
                      ) as HTMLInputElement;
                      handlePasswordSubmit(Number(input.value));
                    }}
                  >
                    Continuer
                  </div>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <Card
        className="@container/card cursor-pointer"
        onClick={handleCardClickWithPassword}
      >
        <StaffCardHeader
          firstname={firstname}
          lastname={lastname}
          timer={timer}
        />

        <div className={hidden}>
          <StaffCardFooter
            startTime={formatTime(startTime)}
            endTime={formatTime(endTime)}
          />
        </div>
      </Card>
    </>
  );
}
