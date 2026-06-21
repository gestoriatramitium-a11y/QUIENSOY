import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import { useI18n } from "../i18n/useI18n.js";
import { cosmetics, getProgression, saveProgression } from "../utils/progression.js";

export default function Customize() {
  const { t } = useI18n();
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
        <p>Unlock local themes, card styles and balls by playing. No purchases, no real-money mechanics.</p>
      </section>
      <CosmeticGroup
        title="Backgrounds"
        items={cosmetics.themes}
        unlocked={progression.unlockedThemes}
        selected={progression.selectedTheme}
        onSelect={(id) => select("selectedTheme", id)}
      />
      <CosmeticGroup
        title="Cards"
        items={cosmetics.cardStyles}
        unlocked={progression.unlockedCosmetics}
        selected={progression.selectedCardStyle}
        onSelect={(id) => select("selectedCardStyle", id)}
      />
      <CosmeticGroup
        title="Balls"
        items={cosmetics.balls}
        unlocked={progression.unlockedCosmetics}
        selected={progression.selectedBall}
        onSelect={(id) => select("selectedBall", id)}
      />
      <AdBanner placement="bottom" />
    </div>
  );
}

function CosmeticGroup({ title, items, unlocked, selected, onSelect }) {
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
              <span>{isUnlocked ? "Unlocked" : "Locked"}</span>
              <h2>{item.label}</h2>
              <p>{isUnlocked ? "Available now" : `Unlock: level ${item.unlockLevel || item.unlockAchievement}`}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
