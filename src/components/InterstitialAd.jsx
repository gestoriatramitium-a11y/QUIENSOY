import { useEffect, useState } from "react";

export default function InterstitialAd({ open, onClose }) {
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
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Game break">
      <div className="modal-card">
        <p className="eyebrow">Game break</p>
        <h2>Your game will continue in a moment</h2>
        <p className="muted">SDK-ready pause. No external banner is shown in the CrazyGames version.</p>
        <button className="primary-button" type="button" onClick={onClose} disabled={seconds > 0}>
          {seconds > 0 ? `Continue in ${seconds}` : "Continue"}
        </button>
      </div>
    </div>
  );
}
