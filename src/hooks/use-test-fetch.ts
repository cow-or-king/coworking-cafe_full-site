// Test ultra-simple pour voir si les useEffect fonctionnent
console.log("🔥🔥🔥 FICHIER use-test-fetch.ts CHARGÉ !!!");

import { useEffect, useState } from "react";

export function useTestFetch() {
  console.log("🎯 HOOK useTestFetch APPELÉ !!!");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀🚀🚀 TEST useEffect SE LANCE ENFIN !!!");

    const testFetch = async () => {
      try {
        console.log("🚀 Début fetch test...");
        const response = await fetch("/api/reporting?range=yesterday");
        console.log("🚀 Response status:", response.status);

        const result = await response.json();
        console.log("🚀 Response data:", result);

        setData(result);
        setLoading(false);
        console.log("🚀 FIN fetch test - SUCCESS !");
      } catch (error) {
        console.error("🚀 ERROR dans fetch test:", error);
        setLoading(false);
      }
    };

    testFetch();
  }, []);

  console.log("🎯 RETURNING useTestFetch:", { data, loading });
  return { data, loading };
}
