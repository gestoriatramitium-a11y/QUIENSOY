import AdBanner from "../components/AdBanner.jsx";
import { useI18n } from "../i18n/useI18n.js";

const COPY = {
  es: {
    eyebrow: "Reglas",
    title: "Como jugar",
    cta: "Jugar el reto de hoy",
    rules: [
      "Elige un tramo de edad: 10-17, 18-25, 26-35 o mas de 35.",
      "Cada tramo tiene un futbolista oculto diario con nombres mas reconocibles para ese publico.",
      "Tienes 6 intentos para acertar el nombre.",
      "Cada fallo desbloquea una pista nueva. Tambien puedes ver una ayuda recompensada preparada para CrazyGames.",
      "Cuantas menos pistas uses, mejor puntuacion obtienes. Al terminar puedes compartir tu resultado."
    ]
  },
  en: {
    eyebrow: "Rules",
    title: "How to Play",
    cta: "Play today's challenge",
    rules: [
      "Choose an age range: 10-17, 18-25, 26-35 or over 35.",
      "Each range has a daily hidden footballer with names that audience is more likely to know.",
      "You have 6 attempts to guess the name.",
      "Each wrong answer unlocks a new clue. You can also use a rewarded helper prepared for CrazyGames.",
      "The fewer clues you use, the better your score. When you finish, you can share your result."
    ]
  }
};

export default function HowToPlay() {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;

  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
      </section>
      <section className="rules-list">
        {copy.rules.map((rule, index) => (
          <article key={rule}>
            <span>{index + 1}</span>
            <p>{rule}</p>
          </article>
        ))}
      </section>
      <a className="primary-button" href="/jugar">
        {copy.cta}
      </a>
      <AdBanner placement="bottom" />
    </div>
  );
}
