# ¿Quién Soy? Fútbol

Juego web diario, estático y mobile-first para adivinar un futbolista oculto mediante pistas progresivas. La primera versión funciona sin backend, sin base de datos y guarda estadísticas en `localStorage`.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Compilación

```bash
npm run build
```

La salida se genera en `dist/`, lista para Netlify.

## Despliegue en Netlify

1. Sube el proyecto a GitHub.
2. Crea un nuevo sitio en Netlify conectado al repositorio.
3. Usa estos ajustes:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. `netlify.toml` ya incluye el redirect a `index.html` para que funcionen las rutas de la SPA.

## Cambiar dominio

El dominio provisional es:

```text
https://quien-soy-futbol.netlify.app
```

Para cambiarlo:

- Edita `src/config/game.js` y cambia `SITE_URL`.
- Edita `public/sitemap.xml` con el nuevo dominio.
- Revisa el canonical inicial de `index.html`.

## Añadir jugadores

Edita `src/data/players.js`. Cada futbolista debe tener:

- `id`
- `nombre`
- `nacionalidad`
- `posicion`
- `liga`
- `clubGenerico`
- `edad`
- `pieDominante`
- `pistas`
- `dificultad`
- `tags`

No uses fotos oficiales, escudos, logos, camisetas reales, marcas registradas ni imágenes protegidas.

## Anuncios demo e internos

La configuración principal está en `src/config/ads.js`.

- `adsEnabled`: activa o desactiva todos los espacios publicitarios.
- `demoAds`: indica que los interstitials y rewarded son simulados.
- `internalAdsEnabled`: muestra banners internos como fallback.
- `provider`: actualmente `"internal"`.
- `interstitialFrequency`: preparado para controlar frecuencia futura.
- `rewardedEnabled`: preparado para ayudas a cambio de anuncio.

Los banners internos se editan en `src/config/internalAds.js`. Ahí están los enlaces y textos de:

- FacturaRadar
- IARadar
- Tramitium

## Futura publicidad externa

`src/config/ads.js` contiene los campos donde colocar:

- `adsenseClient`
- `adsenseSlotTop`
- `adsenseSlotBottom`
- activación futura de Google H5 Games Ads

Cuando haya una red aprobada, crea un adaptador real dentro de los componentes de anuncios y deja `InternalAdBanner` como fallback. Los interstitials deben mostrarse solo en momentos naturales: al terminar una partida, después de compartir o antes de repetir, nunca mientras el usuario escribe.

## Estadísticas y reto diario

Las estadísticas se guardan en `localStorage`:

- partidas jugadas
- victorias
- derrotas
- racha actual
- mejor racha
- última partida
- distribución de intentos
- puntuación total

El jugador diario se elige de forma determinista según la fecha en `src/utils/datePlayer.js`, sin backend.

## Modo desarrollo

`src/config/game.js` incluye:

```js
export const DEV_ALLOW_REPLAY = false;
```

En producción debe permanecer en `false` para evitar repetir infinitamente el reto diario. Puedes ponerlo en `true` durante pruebas locales.

## Aviso legal visual

El proyecto es un juego no oficial. No está afiliado a clubes, ligas, competiciones ni futbolistas. La interfaz usa siluetas, campo, balón y elementos genéricos.
