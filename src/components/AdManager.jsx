import AdBanner from "./AdBanner.jsx";
import StickyAdBanner from "./StickyAdBanner.jsx";
import InterstitialAd from "./InterstitialAd.jsx";
import RewardedAdModal from "./RewardedAdModal.jsx";

export { AdBanner, StickyAdBanner, InterstitialAd, RewardedAdModal };

export default function AdManager({ placement = "top" }) {
  return <AdBanner placement={placement} />;
}
