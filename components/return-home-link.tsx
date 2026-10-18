"use client";

import type { MouseEvent } from "react";

const STORAGE_KEY = "prospecta-home-return";

function cameFromHome() {
  try {
    const ref = new URL(document.referrer);
    return ref.origin === window.location.origin && ref.pathname === "/";
  } catch {
    return false;
  }
}

export function ReturnHomeLink() {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(STORAGE_KEY);
    } catch {
      saved = null;
    }

    if (saved !== null && cameFromHome() && window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign(saved !== null ? "/" : "/#noticias");
  }

  return (
    <a className="return-home" href="/#noticias" onClick={onClick}>
      ← Voltar à página inicial
    </a>
  );
}
