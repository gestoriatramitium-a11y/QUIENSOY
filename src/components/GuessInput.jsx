import { useState } from "react";
import { useI18n } from "../i18n/useI18n.js";

export default function GuessInput({ disabled, onGuess }) {
  const { language, t } = useI18n();
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!value.trim()) return;
    onGuess(value);
    setValue("");
  }

  return (
    <form className="guess-form" onSubmit={handleSubmit}>
      <label htmlFor="guess">{t("typeAnswer")}</label>
      <div className="guess-row">
        <input
          id="guess"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={language === "es" ? "Ej: Mbappe" : "E.g. Mbappe"}
          autoComplete="off"
          disabled={disabled}
        />
        <button className="primary-button" type="submit" disabled={disabled || !value.trim()}>
          {t("guess")}
        </button>
      </div>
    </form>
  );
}
