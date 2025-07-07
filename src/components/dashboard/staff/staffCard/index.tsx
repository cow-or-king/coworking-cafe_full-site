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

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCardClick = async () => {
    if (!timer) {
      // Démarrer le pointage
      const now = new Date().toISOString();
      const formattedNow = formatTime(now);
      setStartTime(now);
      setTimer(true);
      toast.success("Pointage démarré à " + formattedNow);
    } else {
      // Arrêter le pointage
      const now = new Date().toISOString();
      const formattedNow = formatTime(now);
      setEndTime(now);
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
        console.log("Pointage enregistré :", result);
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'enregistrement du pointage.");
      }
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
