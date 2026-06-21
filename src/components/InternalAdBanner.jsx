import { useEffect, useMemo, useState } from "react";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { internalAds } from "../config/internalAds.js";

const placementOffsets = {
  top: 0,
  bottom: 1,
  interstitial: 2,
  result: 0,
  rewarded: 1,
  home: 2
};

export default function InternalAdBanner({ placement = "top", compact = false }) {
  const [tick, setTick] = useState(0);
  const ad = useMemo(() => {
    const offset = placementOffsets[placement] ?? 0;
    return internalAds[(tick + offset) % internalAds.length];
  }, [tick, placement]);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((value) => value + 1), 9000);
    return () => window.clearInterval(interval);
  }, []);

  if (PLATFORM_CONFIG.platform === "crazygames" || !PLATFORM_CONFIG.enableInternalAds) return null;

  return (
    <a
      className={`internal-ad internal-ad--${ad.theme} ${compact ? "internal-ad--compact" : ""}`}
      href={ad.url}
      target="_blank"
      rel="noreferrer"
      data-placement={placement}
    >
      <span className="ad-label">Publicidad</span>
      <span className="ad-copy">
        <strong>{ad.title}</strong>
        <small>{ad.text}</small>
      </span>
      <span className="ad-cta">{ad.cta}</span>
    </a>
  );
}
