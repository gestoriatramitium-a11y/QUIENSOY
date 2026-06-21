export default function GameCard({ player, revealedExtra, modeLabel }) {
  const isClub = player?.tipo === "club";

  return (
    <section className="game-card">
      <div className="player-silhouette" aria-label={isClub ? "Icono genérico de club" : "Silueta genérica de futbolista"}>
        <div className="silhouette-head" />
        <div className="silhouette-body" />
        <div className="silhouette-ball" />
      </div>
      <div className="player-hidden-info">
        <p className="eyebrow">{modeLabel || (isClub ? "Club oculto" : "Futbolista oculto")}</p>
        <h2>{isClub ? "¿Qué club soy?" : "¿Quién soy?"}</h2>
        <div className="meta-grid">
          <span>Dificultad: {player?.dificultad}</span>
          {isClub ? <span>Tipo: club europeo</span> : <span>Pie: {player?.pieDominante || "?"}</span>}
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
