import { useState } from "react";
import { shareResult } from "../utils/share.js";
import { recordShare } from "../utils/storage.js";

export default function ShareButton({ result, onShared }) {
  const [status, setStatus] = useState("");

  async function handleShare() {
    try {
      const action = await shareResult(result);
      recordShare();
      setStatus(action === "shared" ? "Resultado compartido." : "Resultado copiado al portapapeles.");
      onShared?.();
    } catch {
      setStatus("No se pudo compartir. Prueba a copiarlo de nuevo.");
    }
  }

  return (
    <div className="share-box">
      <button className="primary-button" type="button" onClick={handleShare}>
        Compartir resultado
      </button>
      <button className="ghost-button" type="button" onClick={handleShare}>
        Copiar resultado
      </button>
      {status && <p className="status-text">{status}</p>}
    </div>
  );
}
