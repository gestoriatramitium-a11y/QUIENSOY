import AdBanner from "../components/AdBanner.jsx";

export default function Practice() {
  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="coming-soon">
        <p className="eyebrow">Modo práctica</p>
        <h1>Próximamente: juega retos anteriores.</h1>
        <p>Este modo queda preparado para ampliar el juego sin backend en una versión futura.</p>
        <a className="primary-button" href="/jugar">
          Jugar reto diario
        </a>
      </section>
      <AdBanner placement="bottom" />
    </div>
  );
}
