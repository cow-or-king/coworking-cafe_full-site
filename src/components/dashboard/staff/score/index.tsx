"use client";
import React, { useState } from "react";

type Shift = {
  date: string;
  start: string;
  end: string;
};

export default function StaffScorePage() {
  // Fonction utilitaire pour l'heure actuelle au format HH:MM
  function getCurrentTimeHHMM() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  // Fonction utilitaire pour la date du jour au format YYYY-MM-DD
  function getTodayYYYYMMDD() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [current, setCurrent] = useState<Shift>({
    date: getTodayYYYYMMDD(),
    start: getCurrentTimeHHMM(),
    end: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent({ ...current, [e.target.name]: e.target.value });
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (current.date && current.start && current.end) {
      setShifts([...shifts, current]);
      setCurrent({ date: "", start: "", end: "" });
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">
        Pointage horaire des employé·es
      </h1>
      <form onSubmit={handleAddShift} className="mb-8 space-y-4">
        <div>
          <label className="mb-1 block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={current.date}
            readOnly
            className="w-full cursor-not-allowed rounded border bg-gray-100 px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">Début de service</label>
          <input
            type="time"
            name="start"
            value={current.start}
            onChange={handleChange}
            className="w-full rounded border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">Fin de service</label>
          <input
            type="time"
            name="end"
            value={current.end}
            onChange={handleChange}
            className="w-full rounded border px-2 py-1"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Ajouter
        </button>
      </form>
      <h2 className="mb-2 text-xl font-semibold">Horaires enregistrés</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Début</th>
            <th className="border px-2 py-1">Fin</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{shift.date}</td>
              <td className="border px-2 py-1">{shift.start}</td>
              <td className="border px-2 py-1">{shift.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
