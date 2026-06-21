import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import { getStats, resetStats } from "../utils/storage.js";

export default function Stats() {
  const [stats, setStats] = useState(() => getStats());

  function handleReset() {
    resetStats();
    setStats(getStats());
  }

  return (
    <div className="page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">Tu rendimiento</p>
        <h1>Estadísticas</h1>
        <p>Consulta puntos, rachas, medallas, victorias y resultados por modo. Los datos se guardan solo en este dispositivo.</p>
      </section>
      <StatsPanel stats={stats} />
      <button className="danger-button" type="button" onClick={handleReset}>
        Resetear estadísticas
      </button>
      <AdBanner placement="bottom" />
    </div>
  );
}
