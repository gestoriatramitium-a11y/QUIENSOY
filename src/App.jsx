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
    title: "Who Am I? Football | Football Guessing Game",
    description: "Play Who Am I? Football for free. Guess footballers and clubs with progressive clues, quick modes, stats and shareable results."
  },
  "/jugar": {
    title: "Play Who Am I? Football | Daily and Quick Football Challenges",
    description: "Choose a game mode and guess footballers or European clubs with clues, streaks, points and shareable results."
  },
  "/estadisticas": {
    title: "Stats | Who Am I? Football",
    description: "Check your points, streaks, achievements, wins and results by game mode."
  },
  "/como-jugar": {
    title: "How to Play | Who Am I? Football",
    description: "Learn the rules: clues, attempts, modes, streaks, points and shareable results."
  },
  "/ranking": {
    title: "Ranking | Who Am I? Football",
    description: "Check your local ranking, best modes, best streak and score in Who Am I? Football."
  },
  "/privacidad": {
    title: "Privacy Policy | Who Am I? Football",
    description: "Privacy information about local storage, language, stats, progression and the CrazyGames-focused build."
  },
  "/contacto": {
    title: "Contact | Who Am I? Football",
    description: "Contact the Who Am I? Football team for ideas, bugs or game mode proposals."
  },
  "/practica": {
    title: "Practice | Who Am I? Football",
    description: "Set up free games by type, category, difficulty and age group."
  },
  "/ajustes": {
    title: "Settings | Who Am I? Football",
    description: "Change language, sound, vibration and local preferences."
  },
  "/personalizar": {
    title: "Customize | Who Am I? Football",
    description: "Choose unlocked cosmetics, visual themes and card styles."
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
    title: "Page Not Found | Who Am I? Football",
    description: "The page you are looking for is not available. Return to the football guessing game."
  };
  const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

  document.title = meta.title;
  document.documentElement.lang = "en";
  setMeta("name", "description", meta.description);
  setMeta("property", "og:site_name", "Who Am I? Football");
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
