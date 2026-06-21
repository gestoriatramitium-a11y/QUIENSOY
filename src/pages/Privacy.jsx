import AdBanner from "../components/AdBanner.jsx";
import { PLATFORM_CONFIG } from "../config/platform.js";

export default function Privacy() {
  return (
    <div className="page text-page">
      <AdBanner placement="top" />
      <h1>Privacy Policy</h1>
      <p>
        Who Am I? Football does not use login, a private backend, or a private database. Gameplay data is stored locally
        in the browser.
      </p>
      <p>
        Local statistics, language, progress, level, achievements, settings and cosmetics are saved with localStorage on
        this device.
      </p>
      <p>
        This CrazyGames-focused build does not show external commercial banners or links. Monetization is prepared for a
        future platform SDK integration with safe fallback behavior.
      </p>
      <p>
        Current platform configuration: <strong>{PLATFORM_CONFIG.platform}</strong>.
      </p>
      <AdBanner placement="bottom" />
    </div>
  );
}
