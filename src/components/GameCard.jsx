import { useI18n } from "../i18n/useI18n.js";
import { translateDifficulty, translateExtraLabel, translateExtraValue, translateFoot, translateType } from "../i18n/gameText.js";

const COPY = {
  es: {
    clubIcon: "Icono generico de club",
    playerIcon: "Silueta generica de futbolista",
    hiddenClub: "Club oculto",
    hiddenPlayer: "Futbolista oculto",
    whoClub: "Que club soy?",
    whoPlayer: "Quien soy?",
    difficulty: "Dificultad",
    type: "Tipo",
    foot: "Pie"
  },
  en: {
    clubIcon: "Generic club icon",
    playerIcon: "Generic footballer silhouette",
    hiddenClub: "Hidden club",
    hiddenPlayer: "Hidden footballer",
    whoClub: "What club am I?",
    whoPlayer: "Who am I?",
    difficulty: "Difficulty",
    type: "Type",
    foot: "Foot"
  }
};

export default function GameCard({ player, revealedExtra, modeLabel }) {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;
  const isClub = player?.tipo === "club";

  return (
    <section className="game-card">
      <div className="player-silhouette" aria-label={isClub ? copy.clubIcon : copy.playerIcon}>
        <div className="silhouette-head" />
        <div className="silhouette-body" />
        <div className="silhouette-ball" />
      </div>
      <div className="player-hidden-info">
        <p className="eyebrow">{modeLabel || (isClub ? copy.hiddenClub : copy.hiddenPlayer)}</p>
        <h2>{isClub ? copy.whoClub : copy.whoPlayer}</h2>
        <div className="meta-grid">
          <span>
            {copy.difficulty}: {translateDifficulty(player?.dificultad, language)}
          </span>
          {isClub ? (
            <span>
              {copy.type}: {translateType(player?.tipo, language)}
            </span>
          ) : (
            <span>
              {copy.foot}: {translateFoot(player?.pieDominante, language) || "?"}
            </span>
          )}
          {revealedExtra?.map((item) => (
            <span className="extra-chip" key={item.label}>
              {translateExtraLabel(item.label, language)}: {translateExtraValue(item.label, item.value, language)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
