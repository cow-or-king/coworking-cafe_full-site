"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "../../styles/layout.module.css";

export default function DasboardHomePage() {
  const pathname = usePathname();
  return (
    <div className=" flex items-center justify-center h-[90dvh]">
      <div className="flex gap-5 flex-col items-center">
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
