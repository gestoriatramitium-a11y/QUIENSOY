export const ADS_CONFIG = {
  adsEnabled: true,
  demoAds: true,
  internalAdsEnabled: true,
  provider: "internal",
  adsenseClient: "",
  adsenseSlotTop: "",
  adsenseSlotBottom: "",
  h5GamesEnabled: false,
  interstitialFrequency: 2,
  rewardedEnabled: true
};

// AdSense normal: añade el script oficial en index.html cuando tengas cuenta aprobada,
// rellena adsenseClient y los slots de banner, y cambia provider si sustituyes banners internos.
// Google H5 Games Ads: conecta su SDK desde un AdManager real cuando h5GamesEnabled sea true.
// AdinPlay, CrazyGames, GameDistribution u otras redes: crea adaptadores por proveedor dentro
// de los componentes de anuncios y mantiene los banners internos como fallback.
// Banners internos: desactívalos con internalAdsEnabled: false cuando haya inventario externo real.
