import Disclaimer from "./Disclaimer.jsx";
import { PLATFORM_CONFIG } from "../config/platform.js";
import { useI18n } from "../i18n/useI18n.js";

export default function Footer() {
  const { language, t } = useI18n();
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label={language === "es" ? "Enlaces del pie" : "Footer links"}>
        <a href="/">{t("playNow")}</a>
        <a href="/jugar?modo=diario">{t("dailyChallenge")}</a>
        <a href="/practica">{t("practice")}</a>
        <a href="/estadisticas">{t("stats")}</a>
        <a href="/ranking">{t("ranking")}</a>
        <a href="/ajustes">{t("settings")}</a>
        <a href="/personalizar">{t("customize")}</a>
        {PLATFORM_CONFIG.showSeoPages && <a href="/privacidad">{language === "es" ? "Privacidad" : "Privacy"}</a>}
        {PLATFORM_CONFIG.showSeoPages && <a href="/contacto">{language === "es" ? "Contacto" : "Contact"}</a>}
      </nav>
      <Disclaimer />
      <p className="small-text">
        {language === "es"
          ? "Juego no oficial. No afiliado a clubes, ligas, competiciones ni futbolistas."
          : "Unofficial game. Not affiliated with clubs, leagues, competitions or footballers."}
      </p>
    </footer>
  );
}
