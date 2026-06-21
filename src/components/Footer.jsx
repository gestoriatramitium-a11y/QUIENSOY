import Disclaimer from "./Disclaimer.jsx";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { useI18n } from "../i18n/useI18n.js";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Footer links">
        <a href="/">{t("playNow")}</a>
        <a href="/jugar?modo=diario">{t("dailyChallenge")}</a>
        <a href="/practica">{t("practice")}</a>
        <a href="/estadisticas">{t("stats")}</a>
        <a href="/ranking">{t("ranking")}</a>
        <a href="/ajustes">{t("settings")}</a>
        <a href="/personalizar">{t("customize")}</a>
        {PLATFORM_CONFIG.showSeoPages && <a href="/privacidad">Privacidad</a>}
        {PLATFORM_CONFIG.showSeoPages && <a href="/contacto">Contacto</a>}
      </nav>
      <Disclaimer />
      <p className="small-text">Juego no oficial. No afiliado a clubes, ligas, competiciones ni futbolistas.</p>
    </footer>
  );
}
