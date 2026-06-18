import { useEffect, useState } from "react";
import InternalAdBanner from "./InternalAdBanner.jsx";

export default function RewardedAdModal({ open, onReward, onCancel }) {
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
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Ver publicidad para obtener una pista">
      <div className="modal-card">
        <p className="eyebrow">Pista extra</p>
        <h2>Ver publicidad para obtener una pista</h2>
        <p className="muted">Tras la cuenta atrás se desbloqueará una ayuda del jugador oculto.</p>
        <InternalAdBanner placement="rewarded" />
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="primary-button" type="button" onClick={onReward} disabled={seconds > 0}>
            {seconds > 0 ? `Desbloquear en ${seconds}` : "Desbloquear pista"}
          </button>
        </div>
      </div>
    </div>
  );
}
