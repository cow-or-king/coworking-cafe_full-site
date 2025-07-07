import { Card } from "@/components/ui/card";
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
};

export default function StaffCard({
  firstname,
  lastname,
  start,
  end,
  staffId,
}: StaffCardProps) {
  const [form, setForm] = React.useState({
    date: new Date().toISOString().slice(0, 10),
    firstname: firstname || "",
    lastname: lastname || "",
    start: start || "",
    end: end || "",
  });

  const [timer, setTimer] = React.useState<boolean | null>(false);
  const [startTime, setStartTime] = React.useState<string | null>(null);
  const [endTime, setEndTime] = React.useState<string | null>(null);
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [passwordPrompt, setPasswordPrompt] = React.useState(false);

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
  }, [staffId]);

  const handleCardClick = async () => {
    if (isBlocked) return; // Bloquer le clic si isBlocked est vrai

    if (!timer) {
      // Démarrer le pointage
      const now = new Date().toISOString();
      const formattedNow = formatTime(now);
      setStartTime(now);
      document.cookie = `startTime_${staffId}=${now}; path=/`; // Stocker dans les cookies spécifiques au staff
      setTimer(true);
      toast.success("Pointage démarré à " + formattedNow);
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

      // Enregistrer les données de pointage
      const shiftData = {
        staffId, // Utilisation de l'ID réel du staff
        firstName: firstname, // Correction du nom du champ
        lastName: lastname, // Correction du nom du champ
        date: form.date,
        startTime: formatTime(startTime),
        endTime: formattedNow,
      };

      console.log(
        "Envoi de la requête à l'API /api/shift avec les données :",
        shiftData,
      );

      try {
        const response = await fetch("/api/shift", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shiftData),
        });

        console.log("Réponse de l'API :", response);

        if (!response.ok) {
          throw new Error("Erreur lors de l'enregistrement du pointage.");
        }

        const result = await response.json();
        console.log("Pointage enregistré :", result);
      } catch (error) {
        console.error("Erreur lors de la requête à l'API :", error);
        toast.error("Limite de pointages atteinte pour aujourd'hui.");
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

  const handlePasswordSubmit = (password: string) => {
    if (password === "monMotDePasse") {
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
          <div
            className="password-modal"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "50px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
          >
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
                  handlePasswordSubmit(e.currentTarget.value);
                } else if (e.key === "Escape") {
                  setPasswordPrompt(false); // Fermer le modal sur Échap
                }
              }}
            />
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => {
                const input = document.querySelector(
                  ".password-modal input",
                ) as HTMLInputElement;
                handlePasswordSubmit(input.value);
              }}
            >
              Valider
            </button>
          </div>
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

        <StaffCardFooter
          startTime={formatTime(startTime)}
          endTime={formatTime(endTime)}
        />
      </Card>
    </>
  );
}
