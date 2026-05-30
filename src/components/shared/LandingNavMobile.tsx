"use client";

import { useState } from "react";
import Link from "next/link";

export function LandingNavMobile({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="mob-hamburger mob-hamburger-landing"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"}`} />
      </button>

      {open && (
        <div className="mob-nav-overlay" onClick={() => setOpen(false)} />
      )}

      <div className={`mob-nav-menu${open ? " open" : ""}`} role="navigation">
        <a href="#features" className="mob-nav-link" onClick={() => setOpen(false)}>Fitur</a>
        <a href="#themes" className="mob-nav-link" onClick={() => setOpen(false)}>Tema</a>
        <Link href="/pricing" className="mob-nav-link" onClick={() => setOpen(false)}>Pricing</Link>
        <div className="mob-nav-divider" />
        {isLoggedIn ? (
          <Link href="/dashboard" className="mob-nav-link mob-nav-cta" onClick={() => setOpen(false)}>
            <i className="fa-solid fa-house" /> Ke Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="mob-nav-link" onClick={() => setOpen(false)}>Masuk</Link>
            <Link href="/register" className="mob-nav-link mob-nav-cta" onClick={() => setOpen(false)}>
              <i className="fa-solid fa-bolt" /> Daftar Gratis
            </Link>
          </>
        )}
      </div>
    </>
  );
}
