import AdBanner from "../components/AdBanner.jsx";
import { PLATFORM_CONFIG } from "../config/platform.js";

export default function Privacy() {
  return (
    <div className="page text-page">
      <AdBanner placement="top" />
      <h1>Política de privacidad</h1>
      <p>
        Este texto es orientativo y no constituye asesoramiento legal definitivo. ¿Quién Soy? Fútbol no usa login,
        backend ni base de datos propia.
      </p>
      <p>
        Las estadísticas, idioma, progreso, nivel, logros, ajustes, sonido, vibración y cosméticos se guardan en el
        navegador mediante localStorage. Puedes borrar esos datos desde Ajustes o limpiando los datos del navegador.
      </p>
      <p>
        En versión web se pueden mostrar banners internos propios de FacturaRadar, IARadar y Tramitium. En versión
        CrazyGames, la configuración está preparada para ocultar banners externos y usar una integración de plataforma
        cuando se conecte el SDK oficial.
      </p>
      <p>
        Plataforma actual configurada: <strong>{PLATFORM_CONFIG.platform}</strong>. Si en el futuro se activa publicidad
        de terceros o SDK real, habrá que revisar cookies, consentimiento y políticas de cada proveedor.
      </p>
      <AdBanner placement="bottom" />
    </div>
  );
}
