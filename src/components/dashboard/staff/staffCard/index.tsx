import { Card } from "@/components/ui/card";

import { useTypedDispatch } from "@/store/types";
import * as React from "react";
import toast from "react-hot-toast";
import StaffCardFooter from "./staffCardFooter";
import StaffCardHeader from "./staffCardHeader";

type StaffCardProps = {
  firstname: string;
  lastname: string;
  start: string;
  end: string;
};

export default function StaffCard({
  firstname,
  lastname,
  start,
  end,
}: StaffCardProps) {
  const dispatch = useTypedDispatch();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    date: new Date().toISOString().slice(0, 10),
    start: start || "",
    end: end || "",
  });
  const [loading, setLoading] = React.useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCardClick = () => {
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
      const newShift = {
        date: form.date,
        start: formatTime(startTime),
        end: formattedNow,
        id: "", // Ajouter un ID si nécessaire
        firstname,
        lastname,
      };
      dispatch(addShiftAction(newShift));
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

function addShiftAction(newShift: {
  date: string;
  start: string | null;
  end: string | null;
  id: string;
  firstname: string;
  lastname: string;
}): any {
  // Implémenter l'action pour enregistrer le shift dans Redux ou via une API
  console.log("Shift enregistré :", newShift);
  return { type: "ADD_SHIFT", payload: newShift };
}
