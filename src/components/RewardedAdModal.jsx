import { useEffect, useState } from "react";
import { useI18n } from "../i18n/useI18n.js";

const COPY = {
  es: {
    aria: "Pista extra",
    eyebrow: "Pista extra",
    title: "Consigue una pista extra",
    description: "Flujo recompensado preparado para CrazyGames SDK. No se muestra banner externo ni enlace comercial.",
    cancel: "Cancelar",
    unlockIn: "Desbloquear en",
    unlock: "Desbloquear pista"
  },
  en: {
    aria: "Extra clue",
    eyebrow: "Extra clue",
    title: "Get one extra clue",
    description: "CrazyGames SDK-ready rewarded flow. No external banner or commercial link is shown.",
    cancel: "Cancel",
    unlockIn: "Unlock in",
    unlock: "Unlock clue"
  }
};

export default function RewardedAdModal({ open, onReward, onCancel }) {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    if (!open) return undefined;
    setSeconds(3);
    const interval = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={copy.aria}>
      <div className="modal-card">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p className="muted">{copy.description}</p>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onCancel}>
            {copy.cancel}
          </button>
          <button className="primary-button" type="button" onClick={onReward} disabled={seconds > 0}>
            {seconds > 0 ? `${copy.unlockIn} ${seconds}` : copy.unlock}
          </button>
        </div>
      </div>
    </div>
  );
}
