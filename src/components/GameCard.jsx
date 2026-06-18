export default function GameCard({ player, revealedExtra }) {
  return (
    <section className="game-card">
      <div className="player-silhouette" aria-label="Silueta genérica de futbolista">
        <div className="silhouette-head" />
        <div className="silhouette-body" />
        <div className="silhouette-ball" />
      </div>
      <div className="player-hidden-info">
        <p className="eyebrow">Futbolista oculto</p>
        <h2>¿Quién soy?</h2>
        <div className="meta-grid">
          <span>Dificultad: {player.dificultad}</span>
          <span>Pie: {player.pieDominante}</span>
          {revealedExtra?.map((item) => (
            <span className="extra-chip" key={item.label}>
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
