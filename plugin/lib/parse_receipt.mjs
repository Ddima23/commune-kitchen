function fold(s) {
  return String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

export function parseReceiptText(text) {
  const lines = String(text).split("\n").map((l) => l.trim()).filter(Boolean);
  const skipStart = /^(total|subtotal|vat|tax|cash|change|card|discount|thank|receipt|welcome|store|shop|order|number|date|time|tel|phone|item|qty|price|balance|due|customer|yhteensa|summa|totalt|vaxel|vaxling|maksutapa|kvitto|kuitti|kuitin|kassa|asiakas|kund|datum|pvm|troco|dinheiro|cartao|obrigado|recibo|cambio|efectivo|tarjeta|gracias|ticket|fecha|summe|gesamt|bargeld|karte|dank|beleg|mwst|sous|especes|merci|tva|totale|contanti|carta|grazie|scontrino|iva|resto|kontant|kort|takk|kvittering|mva|tak|moms|totaal|contant|pin|bon|btw|razem|gotowka|dziekujemy|paragon|итого|сумма|сдача|наличные|карта|спасибо|чек|дата|товар|количество|цена|итог)(?![a-zа-яё0-9])/u;
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
    name = name.replace(/\s+\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l|cl|dl|oz|lb|st|kpl|pkt|pcs|pc|г|кг|мл|л|шт|уп)\s*$/iu, "").trim();
    name = name.replace(/^[^\p{L}\p{N}]+/u, "").trim();
    if (!name) continue;
    const entry = { item: name };
    if (price !== undefined) entry.price = price;
    items.push(entry);
  }
  return items;
}
