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
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  React.useEffect(() => {
    // Récupérer les données depuis les cookies spécifiques au staff au chargement de la page
    const cookies = document.cookie.split("; ").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    if (cookies[`startTime_${staffId}`]) {
      setStartTime(cookies[`startTime_${staffId}`]);
    }
    if (cookies[`endTime_${staffId}`]) {
      setEndTime(cookies[`endTime_${staffId}`]);
      setTimer(false); // Synchroniser l'état du timer uniquement si endTime est défini
    } else if (
      cookies[`startTime_${staffId}`] &&
      !cookies[`endTime_${staffId}`]
    ) {
      setTimer(true); // Synchroniser l'état du timer uniquement si startTime est défini sans endTime
    }

    // Récupérer shiftId depuis les cookies au chargement de la page
    if (cookies[`shiftId_${staffId}`]) {
      setShiftId(cookies[`shiftId_${staffId}`]);
      // console.log(
      //   "shiftId récupéré depuis les cookies :",
      //   cookies[`shiftId_${staffId}`],
      // );
    }
  }, [staffId]);

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
    if (isBlocked) return; // Bloquer le clic si isBlocked est vrai

    if (!timer) {
      const canStart = await checkShiftLimit();
      if (!canStart) return; // Bloquer le démarrage si la limite est atteinte

      // Démarrer le pointage
      const now = new Date().toISOString();
      const formattedNow = formatTime(now);
      setStartTime(now);
      document.cookie = `startTime_${staffId}=${now}; path=/`; // Stocker dans les cookies spécifiques au staff
      setTimer(true);
      toast.success("Pointage démarré à " + formattedNow);

      // Enregistrer les données de pointage avec une valeur par défaut pour stop
      const shiftData = {
        staffId, // Utilisation de l'ID réel du staff
        firstName: firstname, // Correction du nom du champ
        lastName: lastname, // Correction du nom du champ
        date: form.date,
        startTime: formattedNow,
        endTime: "00:00", // Valeur par défaut pour stop
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
        // console.log("Réponse complète de l'API POST :", result);
        if (result && result.shift && result.shift._id) {
          setShiftId(result.shift._id);
          document.cookie = `shiftId_${staffId}=${result.shift._id}; path=/`; // Stocker shiftId dans les cookies
          // console.log(
          //   "_id du shift enregistré et stocké dans les cookies :",
          //   result.shift._id,
          // );
        } else {
          console.error("Erreur : _id non retourné par l'API POST.");
          toast.error("Erreur lors de l'enregistrement du pointage.");
        }
      } catch (error) {
        console.error("Erreur lors de la requête à l'API:", error);
        toast.error("Erreur lors de l'enregistrement du pointage.");
      }
    } else {
      // Arrêter le pointage
      const now = new Date().toISOString();
      const formattedNow = formatTime(now);
      setEndTime(now);
      const expirationDate = new Date(Date.now() + 10000).toUTCString();
      document.cookie = `startTime_${staffId}=${now}; path=/; expires=${expirationDate}`; // Stocker dans les cookies avec expiration
      document.cookie = `endTime_${staffId}=${now}; path=/; expires=${expirationDate}`; // Stocker dans les cookies avec expiration
      setTimer(false);
      toast.success("Pointage arrêté à " + formattedNow);

      // Mettre à jour la valeur réelle de stop dans la base de données
      const updateData = {
        _id: shiftId, // Utilisation de l'_id stocké pour correspondre à l'API
        endTime: formattedNow,
      };

      try {
        // console.log("Début de la logique pour arrêter le pointage.");

        if (!shiftId) {
          console.error("Erreur : shiftId est null ou undefined.");
          toast.error(
            "Impossible de mettre à jour le pointage. Veuillez réessayer.",
          );
          return;
        }

        if (!formattedNow) {
          console.error("Erreur : endTime est mal formaté.");
          toast.error("Erreur dans le format de l'heure de fin.");
          return;
        }

        // console.log("Données prêtes pour la requête PUT :", {
        //   _id: shiftId,
        //   endTime: formattedNow,
        // });

        const response = await fetch(`/api/shift`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du pointage.");
        }

        const result = await response.json();
        // console.log(
        //   "Pointage mis à jour avec la valeur réelle pour stop:",
        //   result,
        // );
      } catch (error) {
        console.error("Erreur lors de la requête à l'API:", error);
        toast.error("Erreur lors de la mise à jour du pointage.");
      }

      // Bloquer le clic jusqu'au rafraîchissement
      setIsBlocked(true);

      // Réinitialiser uniquement le timer après 10 secondes
      setTimeout(() => {
        setTimer(null);
      }, 5000);

      // Forcer un rafraîchissement de la page après 10 secondes
      setTimeout(() => {
        setIsBlocked(false); // Débloquer le clic après le rafraîchissement
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
