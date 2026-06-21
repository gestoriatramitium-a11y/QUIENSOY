import { useI18n } from "../i18n/useI18n.js";

const COPY = {
  es: {
    aria: "Pistas desbloqueadas",
    locked: "Pista bloqueada"
  },
  en: {
    aria: "Unlocked clues",
    locked: "Locked clue"
  }
};

export default function HintList({ hints, visibleCount }) {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;

  return (
    <section className="hint-list" aria-label={copy.aria}>
      {hints.map((hint, index) => {
        const unlocked = index < visibleCount;
        return (
          <article className={`hint-item ${unlocked ? "hint-item--active" : ""}`} key={`${hint}-${index}`}>
            <span>{index + 1}</span>
            <p>{unlocked ? hint : copy.locked}</p>
          </article>
        );
      })}
    </section>
  );
}
