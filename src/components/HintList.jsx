export default function HintList({ hints, visibleCount }) {
  return (
    <section className="hint-list" aria-label="Pistas desbloqueadas">
      {hints.map((hint, index) => {
        const unlocked = index < visibleCount;
        return (
          <article className={`hint-item ${unlocked ? "hint-item--active" : ""}`} key={hint}>
            <span>{index + 1}</span>
            <p>{unlocked ? hint : "Pista bloqueada"}</p>
          </article>
        );
      })}
    </section>
  );
}
