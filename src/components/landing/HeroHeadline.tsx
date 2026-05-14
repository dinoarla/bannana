"use client";

import { useState, useEffect } from "react";

const WORDS = [
  "link-in-bio",
  "kartu nama digital",
  "portofolio",
  "toko online",
  "bio link",
  "halaman bisnis",
];

export function HeroHeadline() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 280);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="hero-h1">
      Satu halaman untuk<br />
      <span
        className="accent"
        style={{
          display: "inline-block",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity .28s ease, transform .28s ease",
        }}
      >
        {WORDS[idx]}
      </span>
    </h1>
  );
}
