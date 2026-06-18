import Disclaimer from "./Disclaimer.jsx";

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Enlaces de pie de página">
        <a href="/">Inicio</a>
        <a href="/jugar">Jugar</a>
        <a href="/como-jugar">Cómo jugar</a>
        <a href="/estadisticas">Estadísticas</a>
        <a href="/ranking">Ranking</a>
        <a href="/privacidad">Privacidad</a>
        <a href="/contacto">Contacto</a>
      </nav>
      <Disclaimer />
      <p className="small-text">Juego no oficial. No afiliado a clubes, ligas, competiciones ni futbolistas.</p>
    </footer>
  );
}
