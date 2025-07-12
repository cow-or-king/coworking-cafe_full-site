// Test ULTRA minimal pour voir si useEffect fonctionne
console.log("🔥🔥🔥 FICHIER use-minimal-test.ts CHARGÉ !!!");

import { useEffect, useState } from "react";

export function useMinimalTest() {
  console.log("🎯 HOOK useMinimalTest APPELÉ !!!");

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log("🚀🚀🚀 MINIMAL useEffect SE LANCE ENFIN !!!");
    console.log("🚀🚀🚀 useEffect FONCTIONNE ! Incrementing counter...");
    setCounter(1);
    console.log("🚀🚀🚀 Counter updated !");
  }, []);

  console.log("🎯 RETURNING useMinimalTest:", { counter });
  return { counter };
}
