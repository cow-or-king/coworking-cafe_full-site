"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "@/styles/layout.module.css";

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
        href="/"
      >
        Home
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === "/blog" ? styles.active : ""
        }`}
        href="/blog"
      >
        Blog
      </Link>
      <Link
        className={`${styles.link} ${
          pathname === "/dashboard" ? styles.active : ""
        }`}
        href="/dashboard"
      >
        Dashboard
      </Link>
    </nav>
  );
};
