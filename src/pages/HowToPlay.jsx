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
          <p>Elige un tramo de edad: 10-17, 18-25, 26-35 o más de 35.</p>
        </article>
        <article>
          <span>2</span>
          <p>Cada tramo tiene un futbolista oculto diario con nombres más reconocibles para ese público.</p>
        </article>
        <article>
          <span>3</span>
          <p>Tienes 6 intentos para acertar el nombre.</p>
        </article>
        <article>
          <span>4</span>
          <p>Cada fallo desbloquea una pista nueva. También puedes ver un anuncio demo para una pista extra.</p>
        </article>
        <article>
          <span>5</span>
          <p>Cuantas menos pistas uses, mejor puntuación obtienes. Al terminar puedes compartir tu resultado.</p>
        </article>
      </section>
      <a className="primary-button" href="/jugar">
        Jugar el reto de hoy
      </a>
      <AdBanner placement="bottom" />
    </div>
  );
}
