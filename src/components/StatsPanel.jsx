import { SCORE_BY_ATTEMPTS } from "../utils/scoring.js";

export default function StatsPanel({ stats }) {
  const maxDistribution = Math.max(1, ...Object.values(stats.guessDistribution || {}));
  const winRate = stats.gamesPlayed ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <section className="stats-panel">
      <div className="stats-grid">
        <Stat label="Partidas" value={stats.gamesPlayed} />
        <Stat label="Victorias" value={stats.wins} />
        <Stat label="Derrotas" value={stats.losses} />
        <Stat label="Win rate" value={`${winRate}%`} />
        <Stat label="Racha actual" value={stats.currentStreak} />
        <Stat label="Mejor racha" value={stats.bestStreak} />
        <Stat label="Puntos" value={stats.totalScore} />
        <Stat label="Última partida" value={stats.lastPlayedDate || "Sin jugar"} />
      </div>
      <div className="distribution">
        <h2>Distribución de intentos</h2>
        {Object.keys(SCORE_BY_ATTEMPTS).map((attempt) => {
          const value = stats.guessDistribution?.[attempt] || 0;
          return (
            <div className="distribution-row" key={attempt}>
              <span>{attempt}</span>
              <div className="distribution-bar">
                <strong style={{ width: `${Math.max(8, (value / maxDistribution) * 100)}%` }}>{value}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <article className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
