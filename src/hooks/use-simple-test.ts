// Test hook ultra simple pour vérifier fetch
import { useEffect, useState } from "react";

console.log("🎯🎯🎯 FICHIER use-simple-test.ts CHARGÉ !!! 🎯🎯🎯");

export function useSimpleTest() {
  console.log("🎯 SIMPLE TEST HOOK APPELÉ");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🎯 useEffect DÉCLENCHÉE !");

    // Test fetch direct
    fetch("/api/reporting?range=yesterday")
      .then((response) => {
        console.log("🎯 Response reçue:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("🎯 Data reçue:", data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("🎯 Erreur:", error);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
