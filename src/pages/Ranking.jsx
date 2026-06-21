import AdBanner from "../components/AdBanner.jsx";
import { getMode } from "../utils/gameModes.js";
import { getProgression } from "../utils/progression.js";
import { getStats } from "../utils/storage.js";

export default function Ranking() {
  const stats = getStats();
  const progression = getProgression();
  const sortedModes = Object.entries(stats.modes || {}).sort((a, b) => b[1].points - a[1].points);
  const bestMode = sortedModes[0];

  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="coming-soon">
        <p className="eyebrow">Ranking local</p>
        <h1>Tu clasificación en este dispositivo</h1>
        <p>Ranking global próximamente. De momento puedes medir tus mejores modos, rachas y puntuaciones locales.</p>
        <div className="local-score">
          <span>Tu puntuación total</span>
          <strong>{stats.totalScore} puntos</strong>
        </div>
        <div className="local-score">
          <span>Nivel actual</span>
          <strong>{progression.level} · {progression.title}</strong>
        </div>
      </section>
      <section className="mode-stats-grid">
        {sortedModes.map(([modeId, modeStats], index) => (
          <article className="mode-stat-card" key={modeId}>
            <p className="eyebrow">#{index + 1}</p>
            <strong>{getMode(modeId).label}</strong>
            <span>
              {modeStats.points} puntos · {modeStats.wins} victorias
            </span>
          </article>
        ))}
      </section>
      <section className="daily-strip">
        <div>
          <p className="eyebrow">Mejor modo</p>
          <h2>{bestMode ? getMode(bestMode[0]).label : "Sin partidas"}</h2>
        </div>
        <p>
          Mejor racha: {stats.bestStreak} · Rápido: {stats.bestQuickResult?.correct || 0}/5 · Supervivencia:{" "}
          {stats.bestSurvivalResult?.rounds || 0} rondas · Contrarreloj: {stats.bestTimeAttackResult?.score || 0} pts
        </p>
      </section>
      <AdBanner placement="bottom" />
    </div>
  );
}
