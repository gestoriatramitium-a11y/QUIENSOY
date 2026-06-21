import { getComparableForms, isShortAllowed, normalizeText, similarity } from "./normalizeText.js";

export function findBestMatch(userInput, possibleAnswers) {
  const input = normalizeText(userInput);
  if (!input) return { type: "wrong", match: null, score: 0 };

  let best = { type: "wrong", match: null, score: 0, matchedText: "" };

  for (const answer of possibleAnswers) {
    const rawAnswers = [answer.nombre, ...(answer.aliases || [])].filter(Boolean);
    const forms = rawAnswers.flatMap(getComparableForms);
    if (!isShortAllowed(input, rawAnswers)) continue;

    for (const form of forms) {
      const exact = input === form;
      const score = exact ? 1 : similarity(input, form);
      if (score > best.score) {
        best = {
          type: exact ? "exact" : getTypeFromScore(score),
          match: answer,
          score,
          matchedText: form
        };
      }
    }
  }

  return best.score >= 0.72 ? best : { type: "wrong", match: null, score: best.score };
}

function getTypeFromScore(score) {
  if (score >= 0.88) return "accepted_fuzzy";
  if (score >= 0.72) return "suggestion";
  return "wrong";
}
