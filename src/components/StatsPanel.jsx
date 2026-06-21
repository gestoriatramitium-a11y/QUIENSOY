import { SCORE_BY_ATTEMPTS } from "../utils/scoring.js";
import { ACHIEVEMENTS } from "../utils/storage.js";
import { getMode } from "../utils/gameModes.js";

export default function StatsPanel({ stats }) {
  const maxDistribution = Math.max(1, ...Object.values(stats.guessDistribution || {}));
  const winRate = stats.gamesPlayed ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const unlocked = new Set(stats.achievements || []);

  return (
    <section className="stats-panel">
      <div className="stats-grid">
        <Stat label="Partidas" value={stats.gamesPlayed} />
        <Stat label="Victorias" value={stats.wins} />
        <Stat label="Derrotas" value={stats.losses} />
        <Stat label="Acierto" value={`${winRate}%`} />
        <Stat label="Racha diaria" value={stats.currentStreak} />
        <Stat label="Mejor racha" value={stats.bestStreak} />
        <Stat label="Puntos" value={stats.totalScore} />
        <Stat label="Compartidos" value={stats.sharedResults} />
      </div>

      <div className="mode-stats-grid">
        {Object.entries(stats.modes || {}).map(([modeId, modeStats]) => (
          <article className="mode-stat-card" key={modeId}>
            <p className="eyebrow">{getMode(modeId).label}</p>
            <strong>{modeStats.points} pts</strong>
            <span>
              {modeStats.wins}/{modeStats.played} victorias
            </span>
          </article>
        ))}
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

      <div className="achievements-grid">
        <h2>Medallas</h2>
        {ACHIEVEMENTS.map((achievement) => (
          <article className={`achievement ${unlocked.has(achievement.id) ? "achievement--unlocked" : ""}`} key={achievement.id}>
            <strong>{achievement.title}</strong>
            <span>{achievement.description}</span>
          </article>
        ))}
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
