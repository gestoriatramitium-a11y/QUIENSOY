export const SCORE_BY_ATTEMPTS = {
  1: 100,
  2: 85,
  3: 70,
  4: 55,
  5: 40,
  6: 25
};

export function getScore(attempts, won) {
  return won ? SCORE_BY_ATTEMPTS[attempts] ?? 0 : 0;
}
