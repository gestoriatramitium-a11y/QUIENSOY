const removableSuffixes = new Set(["jr", "junior", "júnior"]);

export function normalizeText(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.'’`´-]/g, " ")
    .replace(/[^a-z0-9ñ\s]/g, "")
    .replace(/\b(jr|junior|júnior)\b/g, "junior")
    .replace(/\s+/g, " ")
    .trim();
}

export function getComparableForms(value = "") {
  const normalized = normalizeText(value);
  const words = normalized.split(" ").filter(Boolean);
  const withoutSuffix = words.filter((word) => !removableSuffixes.has(word)).join(" ");
  const firstLast = words.length > 2 ? `${words[0]} ${words.at(-1)}` : normalized;
  const last = words.at(-1) || normalized;
  return [...new Set([normalized, withoutSuffix, firstLast, last].filter(Boolean))];
}

export function isShortAllowed(input, answers = []) {
  const normalized = normalizeText(input);
  if (normalized.length >= 4) return true;
  return answers.some((answer) => normalizeText(answer) === normalized);
}

export function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, index) => [index]);
  for (let column = 0; column <= a.length; column += 1) matrix[0][column] = column;

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

export function similarity(a, b) {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  const distance = levenshtein(left, right);
  const lengthScore = 1 - distance / Math.max(left.length, right.length);
  const leftWords = new Set(left.split(" "));
  const rightWords = new Set(right.split(" "));
  const commonWords = [...leftWords].filter((word) => rightWords.has(word)).length;
  const wordScore = commonWords / Math.max(leftWords.size, rightWords.size);
  const partialScore =
    (right.includes(left) && left.length >= 4) || (left.includes(right) && right.length >= 4) ? 0.92 : 0;
  return Math.max(lengthScore, wordScore, partialScore);
}

export function isCloseGuess(guess, item) {
  const possible = typeof item === "string" ? [{ nombre: item, aliases: [] }] : [item];
  const result = findSimpleBest(guess, possible);
  return result.type === "exact" || result.type === "accepted_fuzzy";
}

function findSimpleBest(input, possibleAnswers) {
  let best = { type: "wrong", score: 0 };
  for (const answer of possibleAnswers) {
    const forms = [answer.nombre, ...(answer.aliases || [])].flatMap(getComparableForms);
    if (!isShortAllowed(input, forms)) continue;
    for (const form of forms) {
      const score = similarity(input, form);
      if (score > best.score) best = { type: score >= 0.88 ? "accepted_fuzzy" : "wrong", score };
      if (normalizeText(input) === form) return { type: "exact", score: 1 };
    }
  }
  return best;
}
