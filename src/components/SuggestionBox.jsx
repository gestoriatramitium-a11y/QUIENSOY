import { useI18n } from "../i18n/useI18n.js";

export default function SuggestionBox({ suggestion, onAccept, onReject }) {
  const { language, t } = useI18n();
  if (!suggestion?.match) return null;

  return (
    <section className="suggestion-box" aria-live="polite">
      <p className="eyebrow">{language === "es" ? "Respuesta parecida" : "Similar answer"}</p>
      <h2>
        {t("didYouMean")} {suggestion.match.nombre}?
      </h2>
      <div className="modal-actions">
        <button className="primary-button" type="button" onClick={onAccept}>
          {t("yesItWas")}
        </button>
        <button className="ghost-button" type="button" onClick={onReject}>
          {t("noKeepTrying")}
        </button>
      </div>
    </section>
  );
}
