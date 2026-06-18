import { useState } from "react";

export default function GuessInput({ disabled, onGuess }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!value.trim()) return;
    onGuess(value);
    setValue("");
  }

  return (
    <form className="guess-form" onSubmit={handleSubmit}>
      <label htmlFor="guess">Escribe el nombre del futbolista</label>
      <div className="guess-row">
        <input
          id="guess"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ej: Mbappe"
          autoComplete="off"
          disabled={disabled}
        />
        <button className="primary-button" type="submit" disabled={disabled || !value.trim()}>
          Probar
        </button>
      </div>
    </form>
  );
}
