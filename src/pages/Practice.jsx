import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import AgeGroupSelector from "../components/AgeGroupSelector.jsx";
import { getPreferredAgeGroup, savePreferredAgeGroup } from "../utils/storage.js";

export default function Practice() {
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
        <p className="eyebrow">Modo entrenamiento</p>
        <h1>Configura tu partida</h1>
        <p>Juega sin esperar al reto diario. Estas partidas suman estadísticas de práctica, pero no afectan a la racha diaria.</p>
      </section>
      <div className="practice-config">
        <Select label="Tipo" value={type} onChange={setType} options={["mixto", "jugadores", "clubes"]} />
        <Select
          label="Categoría"
          value={category}
          onChange={setCategory}
          options={["todos", "liga-espanola", "mundiales", "clubes-europeos"]}
        />
        <Select label="Dificultad" value={difficulty} onChange={setDifficulty} options={["todos", "facil", "media", "dificil"]} />
      </div>
      <AgeGroupSelector selectedAgeGroupId={ageGroupId} onChange={setAgeGroupId} compact />
      <button className="primary-button full-width-button" type="button" onClick={startPractice}>
        Seguir jugando
      </button>
      <AdBanner placement="bottom" />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
