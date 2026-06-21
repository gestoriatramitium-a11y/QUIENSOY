import { useState } from "react";
import { useI18n } from "../i18n/useI18n.js";
import { shareResult } from "../utils/share.js";
import { recordShare } from "../utils/storage.js";

const COPY = {
  es: {
    share: "Compartir resultado",
    copy: "Copiar resultado",
    shared: "Resultado compartido.",
    copied: "Resultado copiado al portapapeles.",
    error: "No se pudo compartir. Prueba a copiarlo de nuevo."
  },
  en: {
    share: "Share result",
    copy: "Copy result",
    shared: "Result shared.",
    copied: "Result copied to clipboard.",
    error: "Could not share. Try copying it again."
  }
};

export default function ShareButton({ result, onShared }) {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;
  const [status, setStatus] = useState("");

  async function handleShare() {
    try {
      const action = await shareResult(result, language);
      recordShare();
      setStatus(action === "shared" ? copy.shared : copy.copied);
      onShared?.();
    } catch {
      setStatus(copy.error);
    }
  }

  return (
    <div className="share-box">
      <button className="primary-button" type="button" onClick={handleShare}>
        {copy.share}
      </button>
      <button className="ghost-button" type="button" onClick={handleShare}>
        {copy.copy}
      </button>
      {status && <p className="status-text">{status}</p>}
    </div>
  );
}
