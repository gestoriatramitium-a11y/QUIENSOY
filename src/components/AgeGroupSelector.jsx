import { AGE_GROUPS } from "../config/ageGroups.js";
import { useI18n } from "../i18n/useI18n.js";

const AGE_COPY = {
  es: {
    aria: "Elegir edad",
    eyebrow: "Elige dificultad por edad",
    title: "Para quien es el reto?",
    difficulty: {
      kids: "Mas facil",
      young: "Actual",
      adults: "Mixto",
      legends: "Nostalgia"
    },
    description: {
      kids: "Jugadores muy actuales, virales y faciles de reconocer para quienes siguen futbol en redes.",
      young: "Mezcla de estrellas actuales y cracks de la ultima decada.",
      adults: "Figuras actuales y nombres que marcaron los anos 2000 y 2010.",
      legends: "Futbolistas muy conocidos para quienes crecieron viendo futbol de los 90, 2000 y 2010."
    }
  },
  en: {
    aria: "Choose age",
    eyebrow: "Choose age difficulty",
    title: "Who is the challenge for?",
    difficulty: {
      kids: "Easier",
      young: "Current",
      adults: "Mixed",
      legends: "Nostalgia"
    },
    description: {
      kids: "Very current, viral and easy-to-recognize players for younger football fans.",
      young: "A mix of current stars and top players from the last decade.",
      adults: "Current stars plus names that shaped the 2000s and 2010s.",
      legends: "Well-known players for fans who grew up watching football in the 90s, 2000s and 2010s."
    }
  }
};

export default function AgeGroupSelector({ selectedAgeGroupId, onChange, compact = false }) {
  const { language } = useI18n();
  const copy = AGE_COPY[language] || AGE_COPY.en;

  return (
    <section className={`age-selector ${compact ? "age-selector--compact" : ""}`} aria-label={copy.aria}>
      <div className="age-selector__header">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
      </div>
      <div className="age-options">
        {AGE_GROUPS.map((group) => (
          <button
            className={`age-option ${selectedAgeGroupId === group.id ? "age-option--active" : ""}`}
            type="button"
            key={group.id}
            onClick={() => onChange(group.id)}
          >
            <strong>{group.shortTitle}</strong>
            <span>{copy.difficulty[group.id] || group.difficultyLabel}</span>
            {!compact && <small>{copy.description[group.id] || group.description}</small>}
          </button>
        ))}
      </div>
    </section>
  );
}
