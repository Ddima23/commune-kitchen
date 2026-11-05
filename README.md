# Commune Kitchen — DSH plugin + skill pack (Finland / Åland)

AI tooling for small communal kitchens, co-living houses, B&Bs, campsites and course centres in Finland and Åland that cook 5–30 covers a day and still run on paper, spreadsheets and gut feel.

## Problem
- Ordering is manual and error-prone; quantities are guesses, waste is high.
- Receiving a delivery means ticking a paper list against a receipt by eye.
- Recipes don't scale cleanly to "10–15 people today" and don't handle allergies.
- Finnish food-safety paperwork (omavalvonta) is a burden for a tiny kitchen.

## What's inside

### Skills (the content pack)
- `recipe-scaling-allergens` — scale any recipe to N covers, convert units, adapt for the 14 EU allergens. Ships `scripts/scale_recipe.py`.
- `ordering-par-sheets` — turn a weekly menu into par/order sheets for 10–15 covers.
- `receipt-checking` — reconcile a delivery against the order sheet.
- `recipe-ideas` — varied, non-repeating dishes from what is in stock.
- `finnish-food-compliance` — self-monitoring (omavalvonta), temperature logs, allergen labelling, Oiva/ÅMHM inspection readiness.

### Tools (the DSH plugin)
- `receipt_parse` — raw receipt text (Finnish/Swedish/English) → structured line items.
- `receipt_check` — match receipt items to the order; tick-off checklist (received / short / missing / not-on-order / use-first / expired).
- `recipe_suggest` — rank dishes by ingredient coverage of current stock, avoiding repeats.

### Data (editable seeds)
- `data/recipes.json` — 10 seed dishes (red/white fish, beef/veg/chicken ragù, dairy dishes, lohikeitto, makaronilaatikko) with allergens.
- `data/products.json` — sample Finnish pantry (dairy-first).
- `data/categories.json` — product category taxonomy.

## Finland / Åland specifics
- Authorities: Ruokavirato (mainland) and ÅMHM on Åland (e.g. Brändö).
- Finnish/Swedish product vocabulary is built into the receipt parser and matcher (maito→milk, lohifilee→salmon fillet, tomaattimurska→canned tomatoes, ...).
- Currency: EUR.

## Receipt flow (photo → checklist)
See [OCR.md](OCR.md) for the tested OCR pipeline (Tesseract + preprocessing).
1. Photograph the paper receipt and attach it.
2. Extract text (agent vision or a local OCR adapter).
3. `receipt_parse` → structured items.
4. `receipt_check` against the order sheet → tick the checklist.

## Target customer
Small communes, co-living kitchens, B&Bs, campsites, course centres, food trucks in Finland, Åland and the Nordics.

## Monetization (model: content packs)
- One-time pack on Gumroad/LemonSqueezy: €29–49.
- Or subscription €15/mo for a growing catalog + updates.
- Free tier: 1 sample skill (lead magnet).

## Repo layout
- `skills/` — skill packs (SKILL.md + scripts)
- `plugin/` — DSH cordis plugin (tools + embedded skills)
- `data/` — seed recipes, products, categories
- `index/` — DSH plugin-market index (JSON) for the Discover tab

## Status / Roadmap
- [x] Product spec
- [x] 5 skills + scaler script (tested)
- [x] receipt_parse / receipt_check / recipe_suggest tools (tested)
- [x] Finnish/Swedish vocabulary + Finnish recipes
- [x] Market index JSON
- [x] OCR strategy tested & documented (see OCR.md) — local Tesseract + preprocessing works, cloud as premium
- [ ] Install/load plugin in DSH and verify
- [ ] Publish (npm or git) + sales page + launch

## Needs from the owner
- A real receipt photo to test the OCR/vision path
- Your real pantry list and weekly menu
- Exact wording of your local ÅMHM self-monitoring requirements (if any)
