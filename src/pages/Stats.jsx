import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import { useI18n } from "../i18n/useI18n.js";
import { getStats, resetStats } from "../utils/storage.js";

const COPY = {
  es: {
    eyebrow: "Tu rendimiento",
    title: "Estadisticas",
    description: "Consulta puntos, rachas, medallas, victorias y resultados por modo. Los datos se guardan solo en este dispositivo.",
    reset: "Resetear estadisticas"
  },
  en: {
    eyebrow: "Your performance",
    title: "Stats",
    description: "Check points, streaks, achievements, wins and results by mode. Data is saved only on this device.",
    reset: "Reset stats"
  }
};

export default function Stats() {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;
  const [stats, setStats] = useState(() => getStats());

  function handleReset() {
    resetStats();
    setStats(getStats());
  }

  return (
    <div className="page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </section>
      <StatsPanel stats={stats} />
      <button className="danger-button" type="button" onClick={handleReset}>
        {copy.reset}
      </button>
      <AdBanner placement="bottom" />
    </div>
  );
}
