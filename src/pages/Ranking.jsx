import AdBanner from "../components/AdBanner.jsx";
import { getStats } from "../utils/storage.js";

export default function Ranking() {
  const stats = getStats();

  return (
    <div className="page narrow-page">
      <AdBanner placement="top" />
      <section className="coming-soon">
        <p className="eyebrow">Competición</p>
        <h1>Ranking global próximamente</h1>
        <p>En una futura versión podrás competir contra otros usuarios.</p>
        <div className="local-score">
          <span>Tu puntuación local</span>
          <strong>{stats.totalScore} puntos</strong>
        </div>
      </section>
      <AdBanner placement="bottom" />
    </div>
  );
}
