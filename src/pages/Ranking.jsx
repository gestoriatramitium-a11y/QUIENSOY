import AdBanner from "../components/AdBanner.jsx";
import { useI18n } from "../i18n/useI18n.js";
import { getMode } from "../utils/gameModes.js";
import { getProgression } from "../utils/progression.js";
import { getStats } from "../utils/storage.js";

export default function Ranking() {
  const { language, t } = useI18n();
  const stats = getStats();
  const progression = getProgression();
  const sortedModes = Object.entries(stats.modes || {}).sort((a, b) => b[1].points - a[1].points);
  const bestMode = sortedModes[0];
  const es = language === "es";

  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="coming-soon">
        <p className="eyebrow">{es ? "Ranking local" : "Local ranking"}</p>
        <h1>{es ? "Tu clasificación en este dispositivo" : "Your ranking on this device"}</h1>
        <p>{es ? "Ranking global próximamente. Compara tus mejores modos, rachas y puntuaciones locales." : "Global ranking coming soon. Compare your best modes, streaks and local scores."}</p>
        <div className="local-score">
          <span>{es ? "Puntuación total" : "Total score"}</span>
          <strong>{stats.totalScore} pts</strong>
        </div>
        <div className="local-score">
          <span>{t("level")}</span>
          <strong>
            {progression.level} · {progression.title}
          </strong>
        </div>
      </section>
      <section className="mode-stats-grid">
        {sortedModes.map(([modeId, modeStats], index) => (
          <article className="mode-stat-card" key={modeId}>
            <p className="eyebrow">#{index + 1}</p>
            <strong>{getTranslatedMode(modeId, language, getMode(modeId).label)}</strong>
            <span>
              {modeStats.points} pts · {modeStats.wins} {es ? "victorias" : "wins"}
            </span>
          </article>
        ))}
      </section>
      <section className="daily-strip">
        <div>
          <p className="eyebrow">{es ? "Mejor modo" : "Best mode"}</p>
          <h2>{bestMode ? getTranslatedMode(bestMode[0], language, getMode(bestMode[0]).label) : es ? "Sin partidas" : "No games yet"}</h2>
        </div>
        <p>
          {es ? "Mejor racha" : "Best streak"}: {stats.bestStreak} · Quick: {stats.bestQuickResult?.correct || 0}/5 · Survival:{" "}
          {stats.bestSurvivalResult?.rounds || 0} · Time Attack: {stats.bestTimeAttackResult?.score || 0} pts
        </p>
      </section>
      <AdBanner placement="bottom" />
    </div>
  );
}

function getTranslatedMode(modeId, language, fallback) {
  const labels = {
    es: {
      diario: "Reto diario",
      rapido: "Modo Rápido",
      supervivencia: "Supervivencia",
      contrarreloj: "Contrarreloj",
      "liga-espanola": "Liga Española",
      mundiales: "Mundiales",
      "clubes-europeos": "Clubes Europeos",
      entrenamiento: "Entrenamiento",
      "especial-semana": "Especial de la semana"
    },
    en: {
      diario: "Daily Challenge",
      rapido: "Quick Match",
      supervivencia: "Survival",
      contrarreloj: "Time Attack",
      "liga-espanola": "Spanish League",
      mundiales: "World Cup Legends",
      "clubes-europeos": "European Clubs",
      entrenamiento: "Practice",
      "especial-semana": "Weekly Special"
    }
  };
  return labels[language]?.[modeId] || fallback;
}
