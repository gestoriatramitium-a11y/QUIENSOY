import { useEffect, useState } from "react";
import InternalAdBanner from "./InternalAdBanner.jsx";

export default function InterstitialAd({ open, onClose }) {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (!open) return undefined;
    setSeconds(5);
    const interval = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Publicidad">
      <div className="modal-card">
        <p className="eyebrow">Publicidad</p>
        <h2>Tu juego continuará en unos segundos</h2>
        <p className="muted">
          Este interstitial es un placeholder transparente hasta conectar una red publicitaria real.
        </p>
        <InternalAdBanner placement="interstitial" />
        <button className="primary-button" type="button" onClick={onClose} disabled={seconds > 0}>
          {seconds > 0 ? `Continuar en ${seconds}` : "Continuar"}
        </button>
      </div>
    </div>
  );
}
