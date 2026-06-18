import AdBanner from "../components/AdBanner.jsx";

export default function HowToPlay() {
  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="page-heading">
        <p className="eyebrow">Reglas</p>
        <h1>Cómo jugar</h1>
      </section>
      <section className="rules-list">
        <article>
          <span>1</span>
          <p>Cada día hay un futbolista oculto igual para todos los usuarios.</p>
        </article>
        <article>
          <span>2</span>
          <p>Tienes 6 intentos para acertar el nombre.</p>
        </article>
        <article>
          <span>3</span>
          <p>Cada fallo desbloquea una pista nueva.</p>
        </article>
        <article>
          <span>4</span>
          <p>Cuantas menos pistas uses, mejor puntuación obtienes.</p>
        </article>
        <article>
          <span>5</span>
          <p>Al terminar puedes compartir tu resultado y retar a tus amigos.</p>
        </article>
      </section>
      <a className="primary-button" href="/jugar">
        Jugar el reto de hoy
      </a>
      <AdBanner placement="bottom" />
    </div>
  );
}
