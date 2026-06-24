export const AGE_GROUPS = [
  {
    id: "kids",
    label: "10-17",
    title: "kids-teens",
    shortTitle: "10-17",
    difficultyLabel: "easy",
    description: "current-young-players",
    playerIds: [
      "jugador-006",
      "jugador-001",
      "jugador-004",
      "jugador-005",
      "jugador-003",
      "jugador-002",
      "jugador-013",
      "jugador-012",
      "jugador-020",
      "jugador-021",
      "jugador-022",
      "jugador-019",
      "jugador-015",
      "jugador-007",
      "jugador-011",
      "jugador-024"
    ]
  },
  {
    id: "young",
    label: "18-25",
    title: "young-adults",
    shortTitle: "18-25",
    difficultyLabel: "current",
    description: "current-stars-last-decade",
    playerIds: [
      "jugador-001",
      "jugador-002",
      "jugador-003",
      "jugador-004",
      "jugador-005",
      "jugador-006",
      "jugador-008",
      "jugador-009",
      "jugador-010",
      "jugador-011",
      "jugador-012",
      "jugador-013",
      "jugador-014",
      "jugador-017",
      "jugador-020",
      "jugador-021",
      "jugador-023",
      "jugador-025",
      "jugador-029",
      "jugador-031"
    ]
  },
  {
    id: "adults",
    label: "26-35",
    title: "adults",
    shortTitle: "26-35",
    difficultyLabel: "mixed",
    description: "current-2000s-2010s",
    playerIds: [
      "jugador-002",
      "jugador-013",
      "jugador-012",
      "jugador-011",
      "jugador-017",
      "jugador-008",
      "jugador-009",
      "jugador-010",
      "jugador-014",
      "jugador-027",
      "jugador-031",
      "jugador-036",
      "jugador-041",
      "jugador-042",
      "jugador-043",
      "jugador-044",
      "jugador-045",
      "jugador-046"
    ]
  },
  {
    id: "legends",
    label: "+35",
    title: "classics-legends",
    shortTitle: "+35",
    difficultyLabel: "nostalgia",
    description: "classic-players",
    playerIds: [
      "jugador-002",
      "jugador-013",
      "jugador-017",
      "jugador-027",
      "jugador-041",
      "jugador-042",
      "jugador-043",
      "jugador-044",
      "jugador-045",
      "jugador-046",
      "jugador-047",
      "jugador-048",
      "jugador-049",
      "jugador-050",
      "jugador-051",
      "jugador-052"
    ]
  }
];

export const DEFAULT_AGE_GROUP_ID = "kids";

export function getAgeGroup(groupId = DEFAULT_AGE_GROUP_ID) {
  return AGE_GROUPS.find((group) => group.id === groupId) || AGE_GROUPS[0];
}
