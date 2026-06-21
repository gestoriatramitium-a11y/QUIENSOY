# Who Am I? Football

HTML5 football guessing game built with Vite, React and JavaScript.

This build is focused on a clean CrazyGames-style version:

- no backend
- no login
- no database
- localStorage for stats, settings and progression
- no external commercial banners
- no links to third-party business websites
- SDK-ready rewarded/interstitial flow with safe fallback

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

The production output is generated in `dist/`.

## Netlify

Build command:

```bash
npm run build
```

Publish directory:

```text
dist
```

`public/_redirects` is included so SPA routes such as `/jugar`, `/ranking`, `/ajustes` and `/personalizar` work when refreshed.

## Platform

Main platform config:

```text
src/config/platform.js
```

Current target:

```js
platform: "crazygames"
```

Ads config:

```text
src/config/ads.js
```

Internal commercial ads are disabled. `src/config/internalAds.js` is intentionally empty.

CrazyGames SDK-safe wrappers:

```text
src/services/crazyGamesSdk.js
src/services/adService.js
```

The SDK is not loaded by default. Functions fall back safely when `window.CrazyGames` is unavailable.

## Game Modes

- Daily Challenge
- Quick Match
- Survival
- Time Attack
- Spanish League
- World Cup Legends
- European Clubs
- Practice
- Weekly Special

## Local Progression

The game stores locally:

- stats
- scores
- streaks
- achievements
- XP
- level
- settings
- unlocked cosmetics

## Legal Visual Policy

Do not use official logos, crests, football kits, player photos or protected visual assets. The game uses names as informational quiz data and generic visuals only.
