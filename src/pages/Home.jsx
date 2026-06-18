import AdBanner from "../components/AdBanner.jsx";
import InternalAdBanner from "../components/InternalAdBanner.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import { getDailyPlayer, getTimeToNextChallenge } from "../utils/datePlayer.js";

export default function Home() {
  const player = getDailyPlayer();

  return (
    <div className="page">
      <AdBanner placement="top" />
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Reto diario</p>
          <h1>¿Quién Soy? Fútbol</h1>
          <p className="hero-lead">
            Adivina el futbolista oculto de hoy con el menor número de pistas posible.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="/jugar">
              Jugar ahora
            </a>
            <a className="ghost-button" href="/estadisticas">
              Ver estadísticas
            </a>
          </div>
        </div>
        <div className="pitch-preview" aria-hidden="true">
          <div className="pitch-lines" />
          <div className="hero-player">
            <span>?</span>
          </div>
        </div>
      </section>

      <section className="daily-strip">
        <div>
          <p className="eyebrow">Jugador de hoy</p>
          <h2>Reto activo</h2>
        </div>
        <p>Nuevo reto en {getTimeToNextChallenge()} · Dificultad {player.dificultad}</p>
      </section>

      <InternalAdBanner placement="home" />

      <section className="content-grid">
        <article>
          <h2>Juego diario de fútbol</h2>
          <p>Un reto rápido para abrir en el móvil, jugar en pocos minutos y volver al día siguiente.</p>
        </article>
        <article>
          <h2>Adivina futbolistas con pistas</h2>
          <p>Cada fallo desbloquea una pista nueva. Cuantas menos pistas uses, mejor puntuación.</p>
        </article>
        <article>
          <h2>Reto para compartir con amigos</h2>
          <p>Comparte tu resultado por WhatsApp, Instagram, Twitter/X o copia el texto al portapapeles.</p>
        </article>
        <article>
          <h2>Vuelve cada día</h2>
          <p>El futbolista se elige según la fecha, así todos juegan el mismo desafío diario.</p>
        </article>
      </section>

      <section className="cta-band">
        <h2>Comparte tu resultado y reta a tus amigos.</h2>
        <a className="primary-button" href="/jugar">
          Empezar reto
        </a>
      </section>

      <div className="quick-links">
        <a href="/como-jugar">Cómo jugar</a>
        <a href="/privacidad">Privacidad</a>
        <a href="/contacto">Contacto</a>
      </div>
      <Disclaimer />
      <AdBanner placement="bottom" />
    </div>
  );
}
