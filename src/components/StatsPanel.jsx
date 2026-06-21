import { SCORE_BY_ATTEMPTS } from "../utils/scoring.js";
import { ACHIEVEMENTS } from "../utils/storage.js";
import { getMode } from "../utils/gameModes.js";
import { useI18n } from "../i18n/useI18n.js";

const STATS_COPY = {
  es: {
    games: "Partidas",
    wins: "Victorias",
    losses: "Derrotas",
    winRate: "Acierto",
    dailyStreak: "Racha diaria",
    bestStreak: "Mejor racha",
    points: "Puntos",
    shared: "Compartidos",
    attemptsDistribution: "Distribucion de intentos",
    achievements: "Medallas",
    victories: "victorias",
    pts: "pts",
    achievementText: {
      "primer-gol": ["Primer Gol", "Gana tu primera partida."],
      "racha-3": ["Racha 3", "Gana 3 retos diarios seguidos."],
      "racha-7": ["Racha 7", "Gana 7 retos diarios seguidos."],
      leyenda: ["Leyenda", "Gana una partida al primer intento."],
      "rey-laliga": ["Rey de LaLiga", "Gana 10 partidas en Liga Espanola."],
      "heroe-mundial": ["Heroe Mundial", "Gana 10 partidas en Mundiales."],
      "experto-europeo": ["Experto Europeo", "Gana 10 partidas en Clubes Europeos."],
      viciado: ["Viciado", "Juega 25 partidas de entrenamiento."],
      "perfecto-rapido": ["Perfecto Rapido", "Acierta 5/5 en Modo Rapido."],
      compartidor: ["Compartidor", "Comparte 5 resultados."],
      "first-match": ["Primera partida", "Juega tu primera partida."],
      "survival-10": ["Supervivencia 10", "Supera 10 rondas en supervivencia."],
      "survival-25": ["Supervivencia 25", "Supera 25 rondas en supervivencia."],
      "time-pro": ["Contrarreloj Pro", "Alcanza rango Pro en contrarreloj."],
      "time-legend": ["Contrarreloj Legend", "Alcanza rango Legend en contrarreloj."],
      "level-10": ["Nivel 10", "Llega al nivel 10."],
      "level-20": ["Nivel 20", "Llega al nivel 20."]
    }
  },
  en: {
    games: "Games",
    wins: "Wins",
    losses: "Losses",
    winRate: "Win rate",
    dailyStreak: "Daily streak",
    bestStreak: "Best streak",
    points: "Points",
    shared: "Shared",
    attemptsDistribution: "Attempts distribution",
    achievements: "Achievements",
    victories: "wins",
    pts: "pts",
    achievementText: {
      "primer-gol": ["First Goal", "Win your first game."],
      "racha-3": ["Streak 3", "Win 3 daily challenges in a row."],
      "racha-7": ["Streak 7", "Win 7 daily challenges in a row."],
      leyenda: ["Legend", "Win a game on the first attempt."],
      "rey-laliga": ["LaLiga King", "Win 10 Spanish League games."],
      "heroe-mundial": ["World Cup Hero", "Win 10 World Cup games."],
      "experto-europeo": ["European Expert", "Win 10 European Clubs games."],
      viciado: ["Hooked", "Play 25 practice games."],
      "perfecto-rapido": ["Perfect Quick Match", "Guess 5/5 in Quick Match."],
      compartidor: ["Sharer", "Share 5 results."],
      "first-match": ["First Match", "Play your first game."],
      "survival-10": ["Survival 10", "Beat 10 rounds in Survival."],
      "survival-25": ["Survival 25", "Beat 25 rounds in Survival."],
      "time-pro": ["Time Attack Pro", "Reach Pro rank in Time Attack."],
      "time-legend": ["Time Attack Legend", "Reach Legend rank in Time Attack."],
      "level-10": ["Level 10", "Reach level 10."],
      "level-20": ["Level 20", "Reach level 20."]
    }
  }
};

export default function StatsPanel({ stats }) {
  const { language } = useI18n();
  const copy = STATS_COPY[language] || STATS_COPY.en;
  const maxDistribution = Math.max(1, ...Object.values(stats.guessDistribution || {}));
  const winRate = stats.gamesPlayed ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const unlocked = new Set(stats.achievements || []);

  return (
    <section className="stats-panel">
      <div className="stats-grid">
        <Stat label={copy.games} value={stats.gamesPlayed} />
        <Stat label={copy.wins} value={stats.wins} />
        <Stat label={copy.losses} value={stats.losses} />
        <Stat label={copy.winRate} value={`${winRate}%`} />
        <Stat label={copy.dailyStreak} value={stats.currentStreak} />
        <Stat label={copy.bestStreak} value={stats.bestStreak} />
        <Stat label={copy.points} value={stats.totalScore} />
        <Stat label={copy.shared} value={stats.sharedResults} />
      </div>

      <div className="mode-stats-grid">
        {Object.entries(stats.modes || {}).map(([modeId, modeStats]) => (
          <article className="mode-stat-card" key={modeId}>
            <p className="eyebrow">{getMode(modeId).label}</p>
            <strong>
              {modeStats.points} {copy.pts}
            </strong>
            <span>
              {modeStats.wins}/{modeStats.played} {copy.victories}
            </span>
          </article>
        ))}
      </div>

      <div className="distribution">
        <h2>{copy.attemptsDistribution}</h2>
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
        <h2>{copy.achievements}</h2>
        {ACHIEVEMENTS.map((achievement) => (
          <article className={`achievement ${unlocked.has(achievement.id) ? "achievement--unlocked" : ""}`} key={achievement.id}>
            <strong>{copy.achievementText[achievement.id]?.[0] || achievement.title}</strong>
            <span>{copy.achievementText[achievement.id]?.[1] || achievement.description}</span>
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
