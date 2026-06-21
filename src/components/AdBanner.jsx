import { ADS_CONFIG } from "../config/ads.js";
import { PLATFORM_CONFIG } from "../config/platform.js";
import InternalAdBanner from "./InternalAdBanner.jsx";
import AdPlaceholder from "./AdPlaceholder.jsx";

export default function AdBanner({ placement = "top" }) {
  if (!ADS_CONFIG.adsEnabled) return null;
  if (PLATFORM_CONFIG.platform === "crazygames") return null;

  return (
    <AdPlaceholder label={`Banner ${placement}`}>
      {ADS_CONFIG.internalAdsEnabled && PLATFORM_CONFIG.enableInternalAds ? (
        <InternalAdBanner placement={placement} />
      ) : (
        <div className="external-ad-note">Slot publicitario preparado para proveedor externo.</div>
      )}
    </AdPlaceholder>
  );
}
