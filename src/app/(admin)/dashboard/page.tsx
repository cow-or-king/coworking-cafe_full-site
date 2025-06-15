"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "../../styles/layout.module.css";

export default function DasboardHomePage() {
  const pathname = usePathname();
  return (
    <div className="flex h-[90dvh] items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        home page dashboard
        <Link
          className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
          href="/"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
