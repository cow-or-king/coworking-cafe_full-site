import { shouldShowDevFeatures } from "@/lib/env-utils";
import { redirect } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérifier si les fonctionnalités de développement sont autorisées
  if (!shouldShowDevFeatures()) {
    redirect("/");
  }

  return <>{children}</>;
}
