import AdBanner from "../components/AdBanner.jsx";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { useI18n } from "../i18n/useI18n.js";

const COPY = {
  es: {
    title: "Politica de privacidad",
    paragraphs: [
      "Quien Soy? Futbol no usa login, backend privado ni base de datos privada. Los datos de juego se guardan localmente en el navegador.",
      "Estadisticas locales, idioma, progreso, nivel, medallas, ajustes y cosmeticos se guardan con localStorage en este dispositivo.",
      "Esta version enfocada a CrazyGames no muestra banners comerciales externos ni enlaces a empresas externas. La monetizacion queda preparada para una futura integracion segura con el SDK de la plataforma."
    ],
    platform: "Configuracion actual de plataforma:"
  },
  en: {
    title: "Privacy Policy",
    paragraphs: [
      "Who Am I? Football does not use login, a private backend, or a private database. Gameplay data is stored locally in the browser.",
      "Local statistics, language, progress, level, achievements, settings and cosmetics are saved with localStorage on this device.",
      "This CrazyGames-focused build does not show external commercial banners or links. Monetization is prepared for a future platform SDK integration with safe fallback behavior."
    ],
    platform: "Current platform configuration:"
  }
};

export default function Privacy() {
  const { language } = useI18n();
  const copy = COPY[language] || COPY.en;

  return (
    <div className="page text-page">
      <AdBanner placement="top" />
      <h1>{copy.title}</h1>
      {copy.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p>
        {copy.platform} <strong>{PLATFORM_CONFIG.platform}</strong>.
      </p>
      <AdBanner placement="bottom" />
    </div>
  );
}
