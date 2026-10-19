"use client";

import { useEffect, useLayoutEffect } from "react";

const LEAFLET_SCRIPT = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadScript(src: string, id: string) {
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") resolve(existing);
      else existing.addEventListener("load", () => resolve(existing), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = false;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve(script);
    });
    script.addEventListener("error", () => reject(new Error(`Falha ao carregar ${src}`)));
    document.body.appendChild(script);
  });
}

const HOME_RETURN_KEY = "prospecta-home-return";

function restoreHomePosition() {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(HOME_RETURN_KEY);
  } catch {
    return;
  }
  if (raw === null) return;
  const top = Number(raw);
  try {
    sessionStorage.removeItem(HOME_RETURN_KEY);
  } catch {
    return;
  }
  if (!Number.isFinite(top)) return;

  const apply = () => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
    root.style.scrollBehavior = previous;
  };

  apply();
  requestAnimationFrame(apply);
  window.setTimeout(apply, 60);
  window.setTimeout(apply, 280);
}

export function LegacyHomeScripts() {
  useLayoutEffect(() => {
    restoreHomePosition();
    window.addEventListener("pageshow", restoreHomePosition);
    return () => window.removeEventListener("pageshow", restoreHomePosition);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const leaflet = await loadScript(LEAFLET_SCRIPT, "prospecta-leaflet");
      if (!active || !leaflet) return;
      await loadScript("/legacy/js/index.js", "prospecta-home-script");
    }

    initialize().catch((error) => console.error(error));

    return () => {
      active = false;
      document.getElementById("prospecta-home-script")?.remove();
    };
  }, []);

  return null;
}
