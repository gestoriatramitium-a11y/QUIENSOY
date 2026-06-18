import { AGE_GROUPS } from "../config/ageGroups.js";

export default function AgeGroupSelector({ selectedAgeGroupId, onChange, compact = false }) {
  return (
    <section className={`age-selector ${compact ? "age-selector--compact" : ""}`} aria-label="Elegir edad">
      <div className="age-selector__header">
        <p className="eyebrow">Elige dificultad por edad</p>
        <h2>¿Para quién es el reto?</h2>
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
            <span>{group.difficultyLabel}</span>
            {!compact && <small>{group.description}</small>}
          </button>
        ))}
      </div>
    </section>
  );
}
