import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import AgeGroupSelector from "../components/AgeGroupSelector.jsx";
import InternalAdBanner from "../components/InternalAdBanner.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import { getAgeGroup } from "../config/ageGroups.js";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { translateAgeGroupLabel, translateDifficulty, translateModeLabel, translateShortModeLabel } from "../i18n/gameText.js";
import { useI18n } from "../i18n/useI18n.js";
import { getDailyPlayer, getTimeToNextChallenge } from "../utils/datePlayer.js";
import { getModeCards, getWeeklyTheme } from "../utils/gameModes.js";
import { getProgression, getXPProgress } from "../utils/progression.js";
import { getPreferredAgeGroup, getStats, savePreferredAgeGroup } from "../utils/storage.js";

const TUTORIAL_KEY = "quienSoyFutbolTutorialSeen";

const COPY = {
  es: {
    heroLead: "Juego rapido de pistas de futbol con retos diarios, supervivencia, contrarreloj, XP y medallas locales.",
    xpProgress: "XP para el siguiente nivel",
    dailyStreak: "Racha diaria",
    totalScore: "Puntuacion total",
    weeklySpecial: "Especial semanal",
    special: "Especial",
    dailyPlayer: "Jugador diario",
    nextIn: "Siguiente en",
    quickTutorial: "Tutorial rapido",
    skip: "Saltar",
    modeDescriptions: {
      diario: "El futbolista diario por tramo de edad. Se bloquea al terminar.",
      "liga-espanola": "Adivina futbolistas actuales e historicos relacionados con la liga espanola.",
      mundiales: "Adivina leyendas y estrellas que marcaron la historia de los Mundiales.",
      "clubes-europeos": "Adivina equipos europeos por pistas sobre pais, colores, historia y competiciones.",
      entrenamiento: "Partidas libres con filtros para seguir jugando sin esperar al reto diario.",
      rapido: "Cinco rondas cortas para movil y partidas rapidas.",
      supervivencia: "Empieza con 3 vidas y supera tantas rondas como puedas.",
      contrarreloj: "Tienes 60 segundos para acertar tantos jugadores o clubes como puedas.",
      "especial-semana": "Un tema semanal elegido automaticamente sin backend."
    },
    weeklyThemes: {
      champions: "Semana Champions",
      "world-legends": "Leyendas del Mundial",
      "laliga-stars": "Estrellas de LaLiga",
      strikers: "Delanteros letales",
      keepers: "Porteros historicos",
      midfielders: "Mediocentros magicos",
      "classic-clubs": "Clasicos europeos",
      "young-stars": "Jovenes promesas",
      "golden-ball": "Balon de Oro",
      "historic-finals": "Finales historicas"
    }
  },
  en: {
    heroLead: "Fast football clue game with daily challenges, survival, time attack, XP and local achievements.",
    xpProgress: "XP to next level",
    dailyStreak: "Daily streak",
    totalScore: "Total score",
    weeklySpecial: "Weekly special",
    special: "Special",
    dailyPlayer: "Daily player",
    nextIn: "Next in",
    quickTutorial: "Quick tutorial",
    skip: "Skip",
    modeDescriptions: {
      diario: "The daily footballer by age range. It locks when you finish.",
      "liga-espanola": "Guess current and historic footballers linked to the Spanish league.",
      mundiales: "Guess legends and stars who shaped World Cup history.",
      "clubes-europeos": "Guess European teams from clues about country, colors, history and competitions.",
      entrenamiento: "Free games with filters so you can keep playing without waiting for the daily challenge.",
      rapido: "Five short rounds for mobile and quick sessions.",
      supervivencia: "Start with 3 lives and survive as many rounds as you can.",
      contrarreloj: "You have 60 seconds to guess as many players or clubs as possible.",
      "especial-semana": "A weekly theme chosen automatically without a backend."
    },
    weeklyThemes: {
      champions: "Champions Week",
      "world-legends": "World Cup Legends",
      "laliga-stars": "LaLiga Stars",
      strikers: "Lethal Strikers",
      keepers: "Historic Goalkeepers",
      midfielders: "Magic Midfielders",
      "classic-clubs": "European Classics",
      "young-stars": "Young Prospects",
      "golden-ball": "Ballon d'Or",
      "historic-finals": "Historic Finals"
    }
  }
};

export default function Home() {
  const { language, t } = useI18n();
  const copy = COPY[language] || COPY.en;
  const [ageGroupId, setAgeGroupId] = useState(() => getPreferredAgeGroup());
  const [showTutorial, setShowTutorial] = useState(() => localStorage.getItem(TUTORIAL_KEY) !== "true");
  const ageGroup = getAgeGroup(ageGroupId);
  const player = getDailyPlayer(new Date(), ageGroupId);
  const stats = getStats();
  const weekly = getWeeklyTheme();
  const progression = getProgression();
  const xp = getXPProgress(progression);

  function handleAgeGroupChange(nextAgeGroupId) {
    setAgeGroupId(nextAgeGroupId);
    savePreferredAgeGroup(nextAgeGroupId);
  }

  function closeTutorial(play = false) {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setShowTutorial(false);
    if (play) window.location.href = "/jugar?modo=rapido";
  }

  return (
    <div className={`page game-menu theme-${progression.selectedTheme}`}>
      {PLATFORM_CONFIG.platform === "web" && <AdBanner placement="top" />}
      {showTutorial && <Tutorial t={t} copy={copy} onClose={closeTutorial} />}
      <section className="hero menu-hero">
        <div className="hero-content">
          <p className="eyebrow">{t("gameSubtitle")}</p>
          <h1>{t("gameTitle")}</h1>
          <p className="hero-lead">{copy.heroLead}</p>
          <div className="hero-actions">
            <a className="primary-button play-now-button" href="/jugar?modo=rapido">
              {t("playNow")}
            </a>
            <a className="ghost-button" href="/jugar?modo=supervivencia">
              {t("survival")}
            </a>
            <a className="ghost-button" href="/jugar?modo=contrarreloj">
              {t("timeAttack")}
            </a>
          </div>
        </div>
        <div className="pitch-preview" aria-hidden="true">
          <div className="pitch-lines" />
          <div className="hero-player">
            <span>?</span>
          </div>
        </div>
      </section>

      <section className="progress-card">
        <div>
          <p className="eyebrow">
            {t("level")} {progression.level}
          </p>
          <h2>{progression.title}</h2>
        </div>
        <div className="xp-track" aria-label="XP progress">
          <span style={{ width: `${xp.percent}%` }} />
        </div>
        <p>
          {progression.xpTotal} XP - {xp.remaining} {copy.xpProgress}
        </p>
      </section>

      <section className="home-stats">
        <article>
          <span>{copy.dailyStreak}</span>
          <strong>{stats.currentStreak}</strong>
        </article>
        <article>
          <span>{copy.totalScore}</span>
          <strong>{stats.totalScore}</strong>
        </article>
        <article>
          <span>{copy.weeklySpecial}</span>
          <strong>{getWeeklyTitle(weekly, copy)}</strong>
        </article>
      </section>

      <section className="mode-grid">
        {getModeCards().map((mode) => (
          <a className="mode-card" href={`/jugar?modo=${mode.id}`} key={mode.id}>
            <span>{translateShortModeLabel(mode.id, language, mode.shortLabel)}</span>
            <h2>{translateModeLabel(mode.id, language, mode.label)}</h2>
            <p>{mode.weekly ? `${copy.special}: ${getWeeklyTitle(weekly, copy)}` : copy.modeDescriptions[mode.id]}</p>
          </a>
        ))}
      </section>

      <AgeGroupSelector selectedAgeGroupId={ageGroupId} onChange={handleAgeGroupChange} />

      <section className="daily-strip">
        <div>
          <p className="eyebrow">{copy.dailyPlayer}</p>
          <h2>
            {t("dailyChallenge")} - {translateAgeGroupLabel(ageGroup, language)}
          </h2>
        </div>
        <p>
          {copy.nextIn} {getTimeToNextChallenge()} - {translateDifficulty(player.dificultad, language)} - {getAgeDifficulty(ageGroup.id, language)}
        </p>
      </section>

      {PLATFORM_CONFIG.platform === "web" && <InternalAdBanner placement="home" />}

      <div className="quick-links">
        <a href="/estadisticas">{t("stats")}</a>
        <a href="/ranking">{t("ranking")}</a>
        <a href="/ajustes">{t("settings")}</a>
        <a href="/personalizar">{t("customize")}</a>
      </div>
      <Disclaimer />
      {PLATFORM_CONFIG.platform === "web" && <AdBanner placement="bottom" />}
    </div>
  );
}

function Tutorial({ t, copy, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="modal-card tutorial-card">
        <p className="eyebrow">{copy.quickTutorial}</p>
        <ol>
          <li>{t("readClues")}</li>
          <li>{t("typeAnswer")}</li>
          <li>{t("useExtra")}</li>
          <li>{t("scoreEarly")}</li>
        </ol>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={() => onClose(false)}>
            {copy.skip}
          </button>
          <button className="primary-button" type="button" onClick={() => onClose(true)}>
            {t("gotItPlay")}
          </button>
        </div>
      </section>
    </div>
  );
}

function getWeeklyTitle(weekly, copy) {
  return copy.weeklyThemes[weekly.id] || weekly.title;
}

function getAgeDifficulty(id, language) {
  const values = {
    es: {
      kids: "Mas facil",
      young: "Actual",
      adults: "Mixto",
      legends: "Nostalgia"
    },
    en: {
      kids: "Easier",
      young: "Current",
      adults: "Mixed",
      legends: "Nostalgia"
    }
  };
  return values[language]?.[id] || values.en[id] || "Mixed";
}
