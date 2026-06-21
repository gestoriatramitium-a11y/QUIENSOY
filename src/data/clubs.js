import { buildClub } from "./dataHelpers.js";

const clubSeeds = [
  ["Real Madrid", "España", "Madrid", "blanco", ["Madrid", "Real", "Los blancos"]],
  ["Barcelona", "España", "Barcelona", "azul y grana", ["Barca", "Barça", "FC Barcelona"]],
  ["Atlético de Madrid", "España", "Madrid", "rojo y blanco", ["Atleti", "Atletico", "Atlético"]],
  ["Sevilla", "España", "Sevilla", "blanco y rojo", ["Sevilla FC"]],
  ["Valencia", "España", "Valencia", "blanco y negro", ["Valencia CF"]],
  ["Manchester United", "Inglaterra", "Manchester", "rojo", ["Man United", "Manchester Utd", "Man Utd", "United"]],
  ["Manchester City", "Inglaterra", "Manchester", "azul celeste", ["Man City", "City"]],
  ["Liverpool", "Inglaterra", "Liverpool", "rojo", ["LFC"]],
  ["Arsenal", "Inglaterra", "Londres", "rojo y blanco", ["Gunners"]],
  ["Chelsea", "Inglaterra", "Londres", "azul", ["Chelsea FC"]],
  ["Tottenham", "Inglaterra", "Londres", "blanco", ["Spurs", "Tottenham Hotspur"]],
  ["Bayern Múnich", "Alemania", "Múnich", "rojo", ["Bayern", "Bayern Munich"]],
  ["Borussia Dortmund", "Alemania", "Dortmund", "amarillo y negro", ["Dortmund", "BVB"]],
  ["PSG", "Francia", "París", "azul", ["Paris Saint Germain", "París", "Paris SG"]],
  ["Marseille", "Francia", "Marsella", "blanco y azul", ["Olympique Marseille", "Marsella"]],
  ["Lyon", "Francia", "Lyon", "blanco", ["Olympique Lyon"]],
  ["Juventus", "Italia", "Turín", "blanco y negro", ["Juve"]],
  ["Inter", "Italia", "Milán", "azul y negro", ["Inter Milan", "Internazionale"]],
  ["Milan", "Italia", "Milán", "rojo y negro", ["AC Milan", "Milán"]],
  ["Napoli", "Italia", "Nápoles", "azul", ["Nápoles"]],
  ["Roma", "Italia", "Roma", "granate", ["AS Roma"]],
  ["Benfica", "Portugal", "Lisboa", "rojo", ["SL Benfica"]],
  ["Porto", "Portugal", "Oporto", "azul y blanco", ["FC Porto"]],
  ["Sporting CP", "Portugal", "Lisboa", "verde y blanco", ["Sporting", "Sporting Portugal"]],
  ["Ajax", "Países Bajos", "Ámsterdam", "blanco y rojo", ["Ajax Amsterdam"]],
  ["PSV", "Países Bajos", "Eindhoven", "rojo y blanco", ["PSV Eindhoven"]],
  ["Feyenoord", "Países Bajos", "Róterdam", "rojo y blanco", ["Feyenoord Rotterdam"]],
  ["Celtic", "Escocia", "Glasgow", "verde y blanco", ["Celtic Glasgow"]],
  ["Rangers", "Escocia", "Glasgow", "azul", ["Glasgow Rangers"]],
  ["Galatasaray", "Turquía", "Estambul", "rojo y amarillo", ["Gala"]],
  ["Fenerbahçe", "Turquía", "Estambul", "amarillo y azul", ["Fenerbahce", "Fener"]],
  ["Besiktas", "Turquía", "Estambul", "blanco y negro", ["Beşiktaş"]],
  ["RB Leipzig", "Alemania", "Leipzig", "blanco y rojo", ["Leipzig"]],
  ["Bayer Leverkusen", "Alemania", "Leverkusen", "rojo y negro", ["Leverkusen", "Bayer"]],
  ["Monaco", "Francia", "Mónaco", "rojo y blanco", ["AS Monaco", "Mónaco"]],
  ["Aston Villa", "Inglaterra", "Birmingham", "granate y azul", ["Villa"]],
  ["Newcastle", "Inglaterra", "Newcastle", "blanco y negro", ["Newcastle United"]],
  ["Lazio", "Italia", "Roma", "azul celeste", ["SS Lazio"]],
  ["Atalanta", "Italia", "Bérgamo", "azul y negro", ["Atalanta BC"]],
  ["Villarreal", "España", "Vila-real", "amarillo", ["Villarreal CF"]]
];

export const clubs = clubSeeds.map(([nombre, pais, ciudad, coloresGenericos, aliases], index) =>
  buildClub(
    {
      nombre,
      pais,
      ciudad,
      coloresGenericos,
      aliases,
      liga: pais,
      competicionFamosa: ["Real Madrid", "Barcelona", "Bayern Múnich", "Liverpool", "Milan", "Ajax"].includes(nombre)
        ? "Champions League"
        : "competiciones europeas",
      dificultad: index < 16 ? "facil" : index < 32 ? "media" : "dificil",
      tags: ["clubes", "europa", pais.toLowerCase()]
    },
    index
  )
);
