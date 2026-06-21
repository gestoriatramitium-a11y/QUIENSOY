export const weeklyThemes = [
  { id: "champions", title: "Semana Champions", tags: ["champions", "europa", "clubes", "liga-espanola"] },
  { id: "world-legends", title: "Leyendas del Mundial", tags: ["mundiales", "leyenda", "world-cup"] },
  { id: "laliga-stars", title: "Estrellas de LaLiga", tags: ["liga-espanola", "laliga"] },
  { id: "strikers", title: "Delanteros letales", tags: ["delantero", "goleador"] },
  { id: "keepers", title: "Porteros históricos", tags: ["portero"] },
  { id: "midfielders", title: "Mediocentros mágicos", tags: ["centrocampista", "mediocentro", "pase"] },
  { id: "classic-clubs", title: "Clásicos europeos", tags: ["clubes", "europa"] },
  { id: "young-stars", title: "Jóvenes promesas", tags: ["joven", "actual"] },
  { id: "golden-ball", title: "Balón de Oro", tags: ["balon de oro", "leyenda"] },
  { id: "historic-finals", title: "Finales históricas", tags: ["mundiales", "finales", "champions"] }
];

export function getWeeklyTheme(date = new Date()) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const week = Math.floor((date.getTime() - firstDay.getTime()) / 604800000);
  return weeklyThemes[week % weeklyThemes.length];
}
