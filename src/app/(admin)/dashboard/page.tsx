"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "@/styles/layout.module.css";

export default function DasboardHomePage() {
  const pathname = usePathname();
  return (
    <Link
      className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
      href="/"
    >
      Home
    </Link>
  );
}
