import { useEffect, useState } from "react";

export default function RewardedAdModal({ open, onReward, onCancel }) {
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
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Extra clue">
      <div className="modal-card">
        <p className="eyebrow">Extra clue</p>
        <h2>Get one extra clue</h2>
        <p className="muted">CrazyGames SDK-ready rewarded flow. No external banner or commercial link is shown.</p>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={onReward} disabled={seconds > 0}>
            {seconds > 0 ? `Unlock in ${seconds}` : "Unlock clue"}
          </button>
        </div>
      </div>
    </div>
  );
}
