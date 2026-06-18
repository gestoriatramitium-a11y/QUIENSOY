export function normalizeText(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s-]/g, "")
    .replace(/\s+/g, " ");
}

export function isCloseGuess(guess, playerName) {
  const normalizedGuess = normalizeText(guess);
  const normalizedName = normalizeText(playerName);
  const nameParts = normalizedName.split(" ").filter((part) => part.length > 2);

  if (!normalizedGuess) return false;
  if (normalizedGuess === normalizedName) return true;
  if (normalizedName.includes(normalizedGuess) && normalizedGuess.length >= 5) return true;
  if (nameParts.includes(normalizedGuess) && normalizedGuess.length >= 4) return true;

  const distance = levenshtein(normalizedGuess, normalizedName);
  return normalizedGuess.length >= 7 && distance <= 2;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, index) => [index]);
  for (let column = 0; column <= a.length; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row <= b.length; row += 1) {
    for (let column = 1; column <= a.length; column += 1) {
      matrix[row][column] =
        b[row - 1] === a[column - 1]
          ? matrix[row - 1][column - 1]
          : Math.min(matrix[row - 1][column - 1] + 1, matrix[row][column - 1] + 1, matrix[row - 1][column] + 1);
    }
  }

  return matrix[b.length][a.length];
}
