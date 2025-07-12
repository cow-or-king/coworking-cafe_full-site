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
  staffId: string;
  mdp: number;
  hidden: string;
};

interface ShiftData {
  firstShift: {
    start: string;
    end: string;
  };
  secondShift: {
    start: string;
    end: string;
  };
  _id?: string;
}

export default function StaffCard({
  firstname,
  lastname,
  staffId,
  mdp,
  hidden,
}: StaffCardProps) {
  const [form, setForm] = React.useState({
    date: new Date().toISOString().slice(0, 10),
    firstname: firstname || "",
    lastname: lastname || "",
    staffId: staffId || "",
    hidden: hidden || "",
  });

  // États pour gérer les shifts
  const [currentShiftData, setCurrentShiftData] =
    React.useState<ShiftData | null>(null);
  const [activeShift, setActiveShift] = React.useState<
    "first" | "second" | null
  >(null);
  const [isFirstShiftActive, setIsFirstShiftActive] = React.useState(false);
  const [isSecondShiftActive, setIsSecondShiftActive] = React.useState(false);
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [passwordPrompt, setPasswordPrompt] = React.useState(false);

  // Compteurs en temps réel
  const [firstShiftElapsed, setFirstShiftElapsed] = React.useState("");
  const [secondShiftElapsed, setSecondShiftElapsed] = React.useState("");

  // Effet pour vérifier le changement de date à minuit
  React.useEffect(() => {
    const checkDateChange = () => {
      const currentDate = new Date().toISOString().slice(0, 10);
      if (currentDate !== form.date) {
        console.log(
          "Changement de date détecté:",
          form.date,
          "->",
          currentDate,
        );

        // Réinitialiser les états pour la nouvelle journée
        setForm((prev) => ({ ...prev, date: currentDate }));
        setCurrentShiftData({
          firstShift: { start: "00:00", end: "00:00" },
          secondShift: { start: "00:00", end: "00:00" },
        });
        setActiveShift(null);
        setIsFirstShiftActive(false);
        setIsSecondShiftActive(false);
        setIsBlocked(false);
        setFirstShiftElapsed("");
        setSecondShiftElapsed("");

        // Afficher une notification
        toast.success(
          "Nouvelle journée ! Les pointages ont été réinitialisés.",
        );
      }
    };

    // Vérifier immédiatement
    checkDateChange();

    // Vérifier toutes les minutes
    const interval = setInterval(checkDateChange, 60000);

    return () => clearInterval(interval);
  }, [form.date]);

  const formatTime = (isoString: string) => {
    if (!isoString || isoString === "00:00" || isNaN(Date.parse(isoString)))
      return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateElapsedTime = (startTime: string, endTime?: string) => {
    if (!startTime || startTime === "00:00") return "";

    const start = new Date(startTime);
    const end = endTime && endTime !== "00:00" ? new Date(endTime) : new Date();
    const diff = end.getTime() - start.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  // Effet pour mettre à jour les compteurs en temps réel
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentShiftData) {
        if (
          isFirstShiftActive &&
          currentShiftData.firstShift.start !== "00:00"
        ) {
          setFirstShiftElapsed(
            calculateElapsedTime(
              currentShiftData.firstShift.start,
              currentShiftData.firstShift.end !== "00:00"
                ? currentShiftData.firstShift.end
                : undefined,
            ),
          );
        }
        if (
          isSecondShiftActive &&
          currentShiftData.secondShift.start !== "00:00"
        ) {
          setSecondShiftElapsed(
            calculateElapsedTime(
              currentShiftData.secondShift.start,
              currentShiftData.secondShift.end !== "00:00"
                ? currentShiftData.secondShift.end
                : undefined,
            ),
          );
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentShiftData, isFirstShiftActive, isSecondShiftActive]);

  // Récupération des données de shift au chargement
  React.useEffect(() => {
    const fetchCurrentShift = async () => {
      try {
        const response = await fetch(
          `/api/shift?staffId=${staffId}&date=${form.date}`,
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du shift.");
        }

        const result = await response.json();
        console.log("Données shift récupérées :", result);

        if (result.shift) {
          setCurrentShiftData(result.shift);

          // Déterminer quel shift est actif
          const { firstShift, secondShift } = result.shift;

          if (firstShift.start !== "00:00" && firstShift.end === "00:00") {
            setActiveShift("first");
            setIsFirstShiftActive(true);
          } else if (
            secondShift.start !== "00:00" &&
            secondShift.end === "00:00"
          ) {
            setActiveShift("second");
            setIsSecondShiftActive(true);
          } else {
            setActiveShift(null);
          }
        } else {
          // Initialiser un nouveau shift si aucun n'existe
          setCurrentShiftData({
            firstShift: { start: "00:00", end: "00:00" },
            secondShift: { start: "00:00", end: "00:00" },
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du shift :", error);
        // Initialiser un nouveau shift en cas d'erreur
        setCurrentShiftData({
          firstShift: { start: "00:00", end: "00:00" },
          secondShift: { start: "00:00", end: "00:00" },
        });
      }
    };

    fetchCurrentShift();
  }, [staffId, form.date]);

  const handleStartStop = async () => {
    if (isBlocked || !currentShiftData) return;

    const now = new Date().toISOString();

    try {
      let updatedShiftData = { ...currentShiftData };

      // Logique pour démarrer/arrêter les shifts
      if (!activeShift) {
        // Démarrer le premier shift
        if (currentShiftData.firstShift.start === "00:00") {
          updatedShiftData.firstShift.start = now;
          setActiveShift("first");
          setIsFirstShiftActive(true);
          toast.success(`Premier shift démarré à ${formatTime(now)}`);
        } else if (currentShiftData.secondShift.start === "00:00") {
          updatedShiftData.secondShift.start = now;
          setActiveShift("second");
          setIsSecondShiftActive(true);
          toast.success(`Deuxième shift démarré à ${formatTime(now)}`);
        } else {
          toast.error("Limite de 2 shifts atteinte pour aujourd'hui.");
          return;
        }
      } else if (activeShift === "first") {
        // Arrêter le premier shift
        updatedShiftData.firstShift.end = now;
        setActiveShift(null);
        setIsFirstShiftActive(false);
        toast.success(`Premier shift arrêté à ${formatTime(now)}`);
      } else if (activeShift === "second") {
        // Arrêter le deuxième shift
        updatedShiftData.secondShift.end = now;
        setActiveShift(null);
        setIsSecondShiftActive(false);
        toast.success(`Deuxième shift arrêté à ${formatTime(now)}`);
      }

      // Envoyer la requête à l'API
      const method = currentShiftData._id ? "PUT" : "POST";
      const body = currentShiftData._id
        ? { _id: currentShiftData._id, ...updatedShiftData }
        : {
            staffId,
            firstName: firstname,
            lastName: lastname,
            date: form.date,
            ...updatedShiftData,
          };

      const response = await fetch("/api/shift", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'${method === "POST" ? "enregistrement" : "mise à jour"} du shift.`,
        );
      }

      const result = await response.json();
      if (result.shift) {
        setCurrentShiftData(result.shift);
      }
    } catch (error) {
      console.error("Erreur lors de la requête à l'API:", error);
      toast.error("Erreur lors de l'opération.");
    }
  };

  const handlePasswordSubmit = (password: number) => {
    if (password === mdp) {
      setPasswordPrompt(false);
      handleStartStop();
    } else {
      toast.error("Mot de passe incorrect.");
    }
  };

  const handleCardClickWithPassword = () => {
    if (isBlocked) return;
    setPasswordPrompt(true);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPasswordPrompt(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (passwordPrompt) {
      setTimeout(() => {
        const input = document.querySelector(
          ".password-modal input",
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 0);
    }
  }, [passwordPrompt]);

  // Déterminer le texte du bouton et l'état
  const getButtonText = () => {
    if (!currentShiftData) return "Chargement...";

    if (activeShift === "first") return "Arrêter Premier Shift";
    if (activeShift === "second") return "Arrêter Deuxième Shift";

    if (currentShiftData.firstShift.start === "00:00")
      return "Démarrer Premier Shift";
    if (currentShiftData.secondShift.start === "00:00")
      return "Démarrer Deuxième Shift";

    return "Shifts terminés";
  };

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
                        setPasswordPrompt(false);
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
          timer={activeShift !== null}
          buttonText={getButtonText()}
        />

        <div className={hidden}>
          <StaffCardFooter
            firstShift={{
              start: currentShiftData
                ? formatTime(currentShiftData.firstShift.start)
                : "",
              end: currentShiftData
                ? formatTime(currentShiftData.firstShift.end)
                : "",
              elapsed: firstShiftElapsed,
            }}
            secondShift={{
              start: currentShiftData
                ? formatTime(currentShiftData.secondShift.start)
                : "",
              end: currentShiftData
                ? formatTime(currentShiftData.secondShift.end)
                : "",
              elapsed: secondShiftElapsed,
            }}
          />
        </div>
      </Card>
    </>
  );
}
