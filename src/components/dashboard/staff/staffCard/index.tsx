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

  return (
    <Card className="@container/card cursor-pointer" onClick={handleCardClick}>
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
  );
}
