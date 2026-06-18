import AdBanner from "../components/AdBanner.jsx";

export default function Privacy() {
  return (
    <div className="page text-page">
      <AdBanner placement="top" />
      <h1>Política de privacidad</h1>
      <p>
        Este texto es orientativo y no constituye asesoramiento legal definitivo. En la primera versión de ¿Quién Soy?
        Fútbol no se recogen datos personales ni existe backend o base de datos.
      </p>
      <p>
        Las estadísticas del juego se guardan en el navegador mediante localStorage. Puedes borrarlas desde la página de
        estadísticas o limpiando los datos del navegador.
      </p>
      <p>
        La web muestra banners internos propios para FacturaRadar, IARadar y Tramitium. En el futuro podría incluir
        publicidad de terceros como Google AdSense, AdSense H5 Games Ads, AdinPlay, CrazyGames, GameDistribution u otras
        redes.
      </p>
      <p>
        Si se activa publicidad de terceros, podrían usarse cookies o identificadores según las políticas de cada
        proveedor. Esta página deberá actualizarse antes de activar esas integraciones.
      </p>
      <AdBanner placement="bottom" />
    </div>
  );
}
