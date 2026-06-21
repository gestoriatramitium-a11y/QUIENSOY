import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import AgeGroupSelector from "../components/AgeGroupSelector.jsx";
import { useI18n } from "../i18n/useI18n.js";
import { getPreferredAgeGroup, savePreferredAgeGroup } from "../utils/storage.js";

const COPY = {
  es: {
    eyebrow: "Modo entrenamiento",
    title: "Configura tu partida",
    description: "Juega sin esperar al reto diario. Estas partidas suman estadisticas de practica, pero no afectan a la racha diaria.",
    type: "Tipo",
    category: "Categoria",
    difficulty: "Dificultad",
    start: "Seguir jugando",
    options: {
      mixto: "Mixto",
      jugadores: "Jugadores",
      clubes: "Clubes",
      todos: "Todos",
      "liga-espanola": "Liga Espanola",
      mundiales: "Mundiales",
      "clubes-europeos": "Clubes Europeos",
      facil: "Facil",
      media: "Media",
      dificil: "Dificil"
    }
  },
  en: {
    eyebrow: "Practice mode",
    title: "Set up your match",
    description: "Play without waiting for the daily challenge. These games count as practice stats but do not affect your daily streak.",
    type: "Type",
    category: "Category",
    difficulty: "Difficulty",
    start: "Keep playing",
    options: {
      mixto: "Mixed",
      jugadores: "Players",
      clubes: "Clubs",
      todos: "All",
      "liga-espanola": "Spanish League",
      mundiales: "World Cup",
      "clubes-europeos": "European Clubs",
      facil: "Easy",
      media: "Medium",
      dificil: "Hard"
    }
  }
};

export default function Practice() {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;
  const [type, setType] = useState("mixto");
  const [category, setCategory] = useState("todos");
  const [difficulty, setDifficulty] = useState("todos");
  const [ageGroupId, setAgeGroupId] = useState(() => getPreferredAgeGroup());

  function startPractice() {
    savePreferredAgeGroup(ageGroupId);
    const params = new URLSearchParams({
      modo: "entrenamiento",
      tipo: type,
      categoria: category,
      dificultad: difficulty,
      edad: ageGroupId
    });
    window.location.href = `/jugar?${params.toString()}`;
  }

  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </section>
      <div className="practice-config">
        <Select label={copy.type} value={type} onChange={setType} options={["mixto", "jugadores", "clubes"]} copy={copy} />
        <Select
          label={copy.category}
          value={category}
          onChange={setCategory}
          options={["todos", "liga-espanola", "mundiales", "clubes-europeos"]}
          copy={copy}
        />
        <Select label={copy.difficulty} value={difficulty} onChange={setDifficulty} options={["todos", "facil", "media", "dificil"]} copy={copy} />
      </div>
      <AgeGroupSelector selectedAgeGroupId={ageGroupId} onChange={setAgeGroupId} compact />
      <button className="primary-button full-width-button" type="button" onClick={startPractice}>
        {copy.start}
      </button>
      <AdBanner placement="bottom" />
    </div>
  );
}

function Select({ label, value, onChange, options, copy }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option value={option} key={option}>
            {copy.options[option] || option}
          </option>
        ))}
      </select>
    </label>
  );
}
