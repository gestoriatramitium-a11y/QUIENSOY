import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import { useI18n } from "../i18n/useI18n.js";
import { cosmetics, getProgression, saveProgression } from "../utils/progression.js";

const COPY = {
  es: {
    description: "Desbloquea temas locales, estilos de tarjeta y balones jugando. Sin compras ni mecanicas de dinero real.",
    backgrounds: "Fondos",
    cards: "Cartas",
    balls: "Balones",
    unlocked: "Desbloqueado",
    locked: "Bloqueado",
    available: "Disponible ahora",
    unlock: "Desbloquear: nivel"
  },
  en: {
    description: "Unlock local themes, card styles and balls by playing. No purchases, no real-money mechanics.",
    backgrounds: "Backgrounds",
    cards: "Cards",
    balls: "Balls",
    unlocked: "Unlocked",
    locked: "Locked",
    available: "Available now",
    unlock: "Unlock: level"
  }
};

export default function Customize() {
  const { language, t } = useI18n();
  const copy = COPY[language] || COPY.en;
  const [progression, setProgression] = useState(getProgression);

  function select(key, value) {
    const next = { ...progression, [key]: value };
    setProgression(next);
    saveProgression(next);
  }

  return (
    <div className="page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">{t("customize")}</p>
        <h1>{t("customize")}</h1>
        <p>{copy.description}</p>
      </section>
      <CosmeticGroup
        title={copy.backgrounds}
        items={cosmetics.themes}
        unlocked={progression.unlockedThemes}
        selected={progression.selectedTheme}
        onSelect={(id) => select("selectedTheme", id)}
        copy={copy}
      />
      <CosmeticGroup
        title={copy.cards}
        items={cosmetics.cardStyles}
        unlocked={progression.unlockedCosmetics}
        selected={progression.selectedCardStyle}
        onSelect={(id) => select("selectedCardStyle", id)}
        copy={copy}
      />
      <CosmeticGroup
        title={copy.balls}
        items={cosmetics.balls}
        unlocked={progression.unlockedCosmetics}
        selected={progression.selectedBall}
        onSelect={(id) => select("selectedBall", id)}
        copy={copy}
      />
      <AdBanner placement="bottom" />
    </div>
  );
}

function CosmeticGroup({ title, items, unlocked, selected, onSelect, copy }) {
  return (
    <section className="cosmetic-group">
      <h2>{title}</h2>
      <div className="mode-grid">
        {items.map((item) => {
          const isUnlocked = unlocked.includes(item.id) || item.unlock === "Inicio";
          return (
            <button
              className={`mode-card cosmetic-card ${selected === item.id ? "age-option--active" : ""}`}
              type="button"
              disabled={!isUnlocked}
              onClick={() => onSelect(item.id)}
              key={item.id}
            >
              <span>{isUnlocked ? copy.unlocked : copy.locked}</span>
              <h2>{item.label}</h2>
              <p>{isUnlocked ? copy.available : `${copy.unlock} ${item.unlockLevel || item.unlockAchievement}`}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
