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
import { SITE_URL } from "./config/game.js";

const pageMeta = {
  "/": {
    title: "¿Quién Soy? Fútbol | Juego diario para adivinar futbolistas",
    description:
      "Juega gratis a ¿Quién Soy? Fútbol. Adivina el futbolista oculto del día con pistas, comparte tu resultado y reta a tus amigos."
  },
  "/jugar": {
    title: "Jugar al reto diario de fútbol | ¿Quién Soy? Fútbol",
    description:
      "Adivina el futbolista de hoy con pistas progresivas. Juego rápido, gratuito y pensado para fans del fútbol."
  },
  "/estadisticas": {
    title: "Tus estadísticas | ¿Quién Soy? Fútbol",
    description:
      "Consulta tus victorias, rachas y resultados en el juego diario de adivinar futbolistas."
  },
  "/como-jugar": {
    title: "Cómo jugar a ¿Quién Soy? Fútbol",
    description:
      "Aprende las reglas del juego diario de fútbol: pistas, intentos, rachas y resultados compartibles."
  },
  "/ranking": {
    title: "Ranking | ¿Quién Soy? Fútbol",
    description:
      "Consulta tu puntuación local y prepárate para el futuro ranking global del reto diario de fútbol."
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
    title: "Modo práctica | ¿Quién Soy? Fútbol",
    description: "Próximamente podrás jugar retos anteriores en el modo práctica de ¿Quién Soy? Fútbol."
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
