export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Inicio">
        <span className="brand-ball">⚽</span>
        <span>¿Quién Soy? Fútbol</span>
      </a>
      <nav className="main-nav" aria-label="Navegación principal">
        <a href="/jugar">Jugar</a>
        <a href="/estadisticas">Stats</a>
        <a href="/como-jugar">Cómo jugar</a>
        <a href="/ranking">Ranking</a>
      </nav>
    </header>
  );
}
