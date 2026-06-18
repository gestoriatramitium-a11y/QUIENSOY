import { useState } from "react";
import AdBanner from "../components/AdBanner.jsx";
import AgeGroupSelector from "../components/AgeGroupSelector.jsx";
import InternalAdBanner from "../components/InternalAdBanner.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import { getAgeGroup } from "../config/ageGroups.js";
import { getDailyPlayer, getTimeToNextChallenge } from "../utils/datePlayer.js";
import { getPreferredAgeGroup, savePreferredAgeGroup } from "../utils/storage.js";

export default function Home() {
  const [ageGroupId, setAgeGroupId] = useState(() => getPreferredAgeGroup());
  const ageGroup = getAgeGroup(ageGroupId);
  const player = getDailyPlayer(new Date(), ageGroupId);

  function handleAgeGroupChange(nextAgeGroupId) {
    setAgeGroupId(nextAgeGroupId);
    savePreferredAgeGroup(nextAgeGroupId);
  }

  return (
    <div className="page">
      <AdBanner placement="top" />
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Reto diario por edades</p>
          <h1>¿Quién Soy? Fútbol</h1>
          <p className="hero-lead">
            Adivina el futbolista oculto de hoy con pistas adaptadas al grupo de edad que elijas.
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

      <AgeGroupSelector selectedAgeGroupId={ageGroupId} onChange={handleAgeGroupChange} />

      <section className="daily-strip">
        <div>
          <p className="eyebrow">Jugador de hoy</p>
          <h2>Reto activo · {ageGroup.shortTitle}</h2>
        </div>
        <p>
          Nuevo reto en {getTimeToNextChallenge()} · Dificultad {player.dificultad} · {ageGroup.difficultyLabel}
        </p>
      </section>

      <InternalAdBanner placement="home" />

      <section className="content-grid">
        <article>
          <h2>Juego diario de fútbol</h2>
          <p>Un reto rápido para abrir en el móvil, jugar en pocos minutos y volver al día siguiente.</p>
        </article>
        <article>
          <h2>Jugadores por edad</h2>
          <p>Elige 10-17, 18-25, 26-35 o más de 35 para recibir futbolistas más reconocibles.</p>
        </article>
        <article>
          <h2>Reto para compartir con amigos</h2>
          <p>Comparte tu resultado por WhatsApp, Instagram, Twitter/X o copia el texto al portapapeles.</p>
        </article>
        <article>
          <h2>Vuelve cada día</h2>
          <p>Cada tramo tiene su propio jugador diario, así puedes jugar en familia sin frustrarte.</p>
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
