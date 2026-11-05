import { score } from "./reconcile.mjs";

function bestMatch(name, cat, available) {
  let best = 0;
  for (const p of available) {
    const pname = typeof p === "string" ? p : (p.name || "");
    const pcat = typeof p === "string" ? undefined : p.category;
    let s = score(name, pname);
    if (cat && pcat && cat === pcat && s > 0) s = Math.min(1, s + 0.15);
    if (s > best) best = s;
  }
  return best;
}

export function matchAvailable(available, recipes, options = {}) {
  const recent = new Set((options.recent || []).map((n) => String(n).toLowerCase().trim()));
  const results = [];
  for (const r of recipes) {
    let covered = 0;
    const missing = [];
    for (const ing of r.ingredients) {
      if (bestMatch(ing.name, ing.category, available) >= 0.5) covered += 1;
      else missing.push(ing.name);
    }
    const total = r.ingredients.length;
    results.push({
      name: r.name,
      tags: r.tags || [],
      coverage: total ? covered / total : 0,
      covered: covered,
      total: total,
      missing: missing,
    });
  }
  return results
    .map((x) => {
      const penalty = recent.has(x.name.toLowerCase().trim()) ? 0.5 : 0;
      return { ...x, sortKey: x.coverage - penalty };
    })
    .sort((a, b) => b.sortKey - a.sortKey);
}

export function renderSuggestions(results) {
  const lines = [];
  lines.push("## What to cook (ranked by what is in stock)");
  lines.push("");
  for (const r of results.slice(0, 6)) {
    const pct = Math.round(r.coverage * 100);
    const miss = r.missing.length ? " - missing: " + r.missing.join(", ") : " - all ingredients available";
    lines.push("- **" + r.name + "** (" + pct + "% in stock)" + miss);
  }
  return lines.join("\n");
}