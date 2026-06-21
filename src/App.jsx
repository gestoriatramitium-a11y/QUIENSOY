import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import StickyAdBanner from "./components/StickyAdBanner.jsx";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Stats from "./pages/Stats.jsx";
import HowToPlay from "./pages/HowToPlay.jsx";
import Ranking from "./pages/Ranking.jsx";
import Privacy from "./pages/Privacy.jsx";
import Contact from "./pages/Contact.jsx";
import Practice from "./pages/Practice.jsx";
import Settings from "./pages/Settings.jsx";
import Customize from "./pages/Customize.jsx";
import { SITE_URL } from "./config/game.js";

const pageMeta = {
  "/": {
    title: "¿Quién Soy? Fútbol | Juego diario para adivinar futbolistas",
    description:
      "Juega gratis a ¿Quién Soy? Fútbol. Adivina jugadores, clubes europeos, estrellas de LaLiga y leyendas de los Mundiales con pistas diarias."
  },
  "/jugar": {
    title: "Jugar a ¿Quién Soy? Fútbol | Reto diario y modos de fútbol",
    description:
      "Elige modo de juego y adivina futbolistas o clubes europeos con pistas progresivas, rachas, puntos y resultados para compartir."
  },
  "/estadisticas": {
    title: "Tus estadísticas | ¿Quién Soy? Fútbol",
    description: "Consulta tus puntos, rachas, medallas, victorias y resultados por modo de juego."
  },
  "/como-jugar": {
    title: "Cómo jugar | ¿Quién Soy? Fútbol",
    description: "Aprende las reglas del juego: pistas, intentos, modos, rachas, puntos y resultados compartibles."
  },
  "/ranking": {
    title: "Ranking | ¿Quién Soy? Fútbol",
    description: "Consulta tu ranking local, mejores modos, mejor racha y puntuación en ¿Quién Soy? Fútbol."
  },
  "/privacidad": {
    title: "Política de privacidad | ¿Quién Soy? Fútbol",
    description:
      "Información sobre privacidad, almacenamiento local y uso de banners internos o futura publicidad en ¿Quién Soy? Fútbol."
  },
  "/contacto": {
    title: "Contacto | ¿Quién Soy? Fútbol",
    description: "Contacta con el equipo de ¿Quién Soy? Fútbol para consultas, ideas o colaboraciones."
  },
  "/practica": {
    title: "Entrenamiento | ¿Quién Soy? Fútbol",
    description: "Configura partidas libres por tipo, categoría, dificultad y edad en ¿Quién Soy? Fútbol."
  },
  "/ajustes": {
    title: "Ajustes | ¿Quién Soy? Fútbol",
    description: "Cambia idioma, sonido, vibración y preferencias locales del juego."
  },
  "/personalizar": {
    title: "Personalizar | ¿Quién Soy? Fútbol",
    description: "Elige cosméticos desbloqueados, temas visuales y estilos de tarjeta."
  }
};

function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

function setMeta(attribute, key, content) {
  let tag = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(href) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = href;
}

function updateMeta(pathname) {
  const meta = pageMeta[pathname] ?? {
    title: "Página no encontrada | ¿Quién Soy? Fútbol",
    description: "La página que buscas no está disponible. Vuelve al reto diario de fútbol."
  };
  const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

  document.title = meta.title;
  setMeta("name", "description", meta.description);
  setMeta("property", "og:site_name", "¿Quién Soy? Fútbol");
  setMeta("property", "og:type", "website");
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.description);
  setMeta("property", "og:url", canonical);
  setMeta("name", "twitter:card", "summary");
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.description);
  setCanonical(canonical);
}

function renderRoute(pathname) {
  if (pathname === "/") return <Home />;
  if (pathname === "/jugar") return <Game />;
  if (pathname === "/estadisticas") return <Stats />;
  if (pathname === "/como-jugar") return <HowToPlay />;
  if (pathname === "/ranking") return <Ranking />;
  if (pathname === "/privacidad") return <Privacy />;
  if (pathname === "/contacto") return <Contact />;
  if (pathname === "/practica") return <Practice />;
  if (pathname === "/ajustes") return <Settings />;
  if (pathname === "/personalizar") return <Customize />;
  return <Home />;
}

export default function App() {
  const pathname = normalizePath(window.location.pathname);

  useEffect(() => {
    updateMeta(pathname);
  }, [pathname]);

  return (
    <>
      <Header />
      <main>{renderRoute(pathname)}</main>
      <Footer />
      <StickyAdBanner />
    </>
  );
}
