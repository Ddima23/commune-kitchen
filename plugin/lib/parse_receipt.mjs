function fold(s) {
  return String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

export function parseReceiptText(text) {
  const lines = String(text).split("\n").map((l) => l.trim()).filter(Boolean);
  const skipStart = /^(total|subtotal|vat|tax|cash|change|card|discount|thank|receipt|welcome|store|shop|order|number|date|time|tel|phone|item|qty|price|balance|due|customer|yhteensa|summa|totalt|vaxel|vaxling|maksutapa|kvitto|kuitti|kuitin|kassa|asiakas|kund|datum|pvm)\b/;
  const skipContains = /(market|prisma|lidl|kauppa|butik|myymala|s-market|k-market)/;
  const items = [];
  for (const line of lines) {
    const f = fold(line);
    if (skipStart.test(f)) continue;
    if (skipContains.test(f)) continue;
    let name = line;
    let price;
    const pm = line.match(/(.*?)\s+(\d+(?:[.,]\d{2}))\s*$/);
    if (pm) { name = pm[1]; price = parseFloat(pm[2].replace(",", ".")); }
    name = name.replace(/^[^a-zA-Z]+/, "").trim();
    if (!name) continue;
    const entry = { item: name };
    if (price !== undefined) entry.price = price;
    items.push(entry);
  }
  return items;
}
