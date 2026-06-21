import { useState } from "react";
import { ADS_CONFIG } from "../config/ads.js";
import { PLATFORM_CONFIG } from "../config/platform.js";
import InternalAdBanner from "./InternalAdBanner.jsx";

export default function StickyAdBanner() {
  const [closed, setClosed] = useState(false);
  if (!ADS_CONFIG.adsEnabled || closed) return null;
  if (PLATFORM_CONFIG.platform === "crazygames") return null;

  return (
    <aside className="sticky-ad" aria-label="Banner inferior">
      <InternalAdBanner placement="bottom" compact />
      <button className="sticky-close" type="button" onClick={() => setClosed(true)} aria-label="Cerrar anuncio">
        ×
      </button>
    </aside>
  );
}
