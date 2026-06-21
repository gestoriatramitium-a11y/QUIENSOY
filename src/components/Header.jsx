import { useI18n } from "../i18n/useI18n.js";

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Home">
        <span className="brand-ball">⚽</span>
        <span>{t("gameTitle")}</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="/jugar?modo=rapido">{t("playNow")}</a>
        <a href="/estadisticas">{t("stats")}</a>
        <a href="/ranking">{t("ranking")}</a>
        <a href="/ajustes">{t("settings")}</a>
      </nav>
    </header>
  );
}
