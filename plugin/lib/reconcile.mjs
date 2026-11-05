const SYNONYMS = {
  tinned: "canned", minced: "ground", aubergine: "eggplant", courgette: "zucchini",
  cilantro: "coriander", capsicum: "pepper", scallion: "spring onion", soda: "water",
  // Finnish (fi)
  maito: "milk", kerma: "cream", voi: "butter", juusto: "cheese", raejuusto: "cottage cheese",
  kvarkki: "cottage cheese", muna: "egg", munat: "egg", kananmuna: "egg",
  lohi: "salmon", kirjolohi: "salmon", siika: "white fish", ahven: "white fish",
  lohifilee: "salmon fillet", lohifile: "salmon fillet", kalafilee: "fish fillet",
  jauheliha: "ground beef", kana: "chicken", broileri: "chicken",
  sipuli: "onion", porkkana: "carrot", tomaatti: "tomato", tomaattimurska: "canned tomatoes",
  peruna: "potato", valkosipuli: "garlic", riisi: "rice", makaroni: "pasta",
  jauho: "flour", sokeri: "sugar", oljy: "oil", oliivioljy: "olive oil",
  // Swedish (sv)
  mjolk: "milk", gradde: "cream", smor: "butter", ost: "cheese", keso: "cottage cheese",
  kvarg: "cottage cheese", agg: "egg", lax: "salmon", sik: "white fish", abborre: "white fish",
  fars: "ground beef", notfars: "ground beef", kyckling: "chicken",
  laxfile: "salmon fillet", fiskfile: "fish fillet",
  lok: "onion", morot: "carrot", tomat: "tomato", tomater: "tomato", krossade: "canned",
  potatis: "potato", vitlok: "garlic", ris: "rice", mjol: "flour", socker: "sugar",
  olja: "oil", olivolja: "olive oil",
};

function singularize(w) {
  if (w.endsWith("ies") && w.length > 3) return w.slice(0, -3) + "y";
  if (w.endsWith("oes")) return w.slice(0, -2);
  if (/(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.endsWith("ss")) return w;
  if (w.endsWith("s") && w.length > 3) return w.slice(0, -1);
  return w;
}

export function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => SYNONYMS[w] || w)
    .join(" ")
    .split(" ")
    .filter(Boolean)
    .map(singularize)
    .join(" ");
}

function tokens(s) {
  return new Set(normalize(s).split(" ").filter(Boolean));
}

export function score(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  const union = A.size + B.size - inter;
  return inter / union;
}

const DAY = 86400000;

export function reconcile(order, received, options = {}) {
  const today = options.today ? new Date(options.today) : new Date();
  const used = new Set();
  const checklist = [];

  for (const o of order) {
    const name = (o && o.item) || "";
    let best = -1;
    let bestIdx = -1;
    for (let i = 0; i < received.length; i++) {
      if (used.has(i)) continue;
      const s = score(name, received[i].item);
      if (s > best) { best = s; bestIdx = i; }
    }
    if (bestIdx >= 0 && best >= 0.5) {
      used.add(bestIdx);
      const r = received[bestIdx];
      let status = "received";
      const notes = [];
      if (typeof o.quantity === "number" && typeof r.quantity === "number") {
        if (r.quantity < o.quantity) {
          status = "short";
          notes.push("got " + r.quantity + (r.unit ? " " + r.unit : "") + " of " + o.quantity + (o.unit ? " " + o.unit : ""));
        }
      }
      if (r.expiry) {
        const d = Date.parse(r.expiry);
        if (!Number.isNaN(d)) {
          const days = Math.round((d - today.getTime()) / DAY);
          if (days < 0) {
            if (status === "received") status = "return";
            notes.push("EXPIRED " + r.expiry);
          } else if (days <= 3) {
            notes.push("use first - expires in " + days + " day(s) (" + r.expiry + ")");
          }
        }
      }
      checklist.push({
        item: name,
        status: status,
        expected: (o.quantity ?? "") + (o.unit ? " " + o.unit : ""),
        received: (r.quantity ?? "") + (r.unit ? " " + r.unit : ""),
        note: notes.join("; "),
      });
    } else {
      checklist.push({
        item: name,
        status: "missing",
        expected: (o.quantity ?? "") + (o.unit ? " " + o.unit : ""),
        received: "",
        note: "",
      });
    }
  }

  const unknownItems = [];
  for (let i = 0; i < received.length; i++) {
    if (!used.has(i)) unknownItems.push(received[i].item);
  }

  const summary = { totalLines: order.length, received: 0, short: 0, missing: 0, unknown: unknownItems.length, expiring: 0, expired: 0 };
  for (const c of checklist) {
    if (c.status === "received") summary.received += 1;
    else if (c.status === "short") summary.short += 1;
    else if (c.status === "missing") summary.missing += 1;
    else if (c.status === "return") summary.expired += 1;
    if (c.note.indexOf("use first") !== -1) summary.expiring += 1;
  }
  return { checklist, unknownItems, summary };
}

const TAG = { received: "received", short: "SHORT", missing: "MISSING", return: "RETURN / EXPIRED" };

export function renderChecklist(result) {
  const s = result.summary;
  const lines = [];
  lines.push("## Receipt check - " + s.received + "/" + s.totalLines + " order lines fully received");
  lines.push("");
  for (const c of result.checklist) {
    const box = c.status === "received" ? "x" : " ";
    const tag = TAG[c.status] || c.status;
    const note = c.note ? " - " + c.note : "";
    lines.push("- [" + box + "] **" + c.item + "** - " + tag + note);
  }
  for (const u of result.unknownItems) {
    lines.push("- [ ] **" + u + "** - NOT ON ORDER (extra or wrong item)");
  }
  lines.push("");
  lines.push("Summary: " + s.received + " received, " + s.short + " short, " + s.missing + " missing, " + s.unknown + " not-on-order, " + s.expiring + " use-first, " + s.expired + " expired/return.");
  return lines.join("\n");
}