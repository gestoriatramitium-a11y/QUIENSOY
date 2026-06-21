import { useEffect, useState } from "react";
import { useI18n } from "../i18n/useI18n.js";

const COPY = {
  es: {
    aria: "Pausa del juego",
    eyebrow: "Pausa del juego",
    title: "Tu partida continuara en un momento",
    description: "Pausa preparada para SDK. No se muestra banner externo en la version CrazyGames.",
    continueIn: "Continuar en",
    continue: "Continuar"
  },
  en: {
    aria: "Game break",
    eyebrow: "Game break",
    title: "Your game will continue in a moment",
    description: "SDK-ready pause. No external banner is shown in the CrazyGames version.",
    continueIn: "Continue in",
    continue: "Continue"
  }
};

export default function InterstitialAd({ open, onClose }) {
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
        <button className="primary-button" type="button" onClick={onClose} disabled={seconds > 0}>
          {seconds > 0 ? `${copy.continueIn} ${seconds}` : copy.continue}
        </button>
      </div>
    </div>
  );
}
