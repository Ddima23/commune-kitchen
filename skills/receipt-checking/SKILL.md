---
name: receipt-checking
description: Reconcile a grocery delivery against the order sheet by reading a receipt photo, matching line items, and producing a tick-off checklist of received, missing, wrong, and expiring products. Use when the user shares a receipt, invoice, or delivery note and wants to check it against what was ordered.
---

# Receipt checking

## Quick start
1. Ask for the receipt (photo/scan) and the order sheet (from ordering-par-sheets).
2. Extract every line item: product, quantity, price, and any expiry/batch date.
3. Normalize names and match to the order sheet (fuzzy match; confirm unknowns).
4. Classify each line: received / missing / substituted / wrong / expiring.
5. Output a checklist and a follow-up list (return, reorder, use-first).

## Matching rules
- Normalize: lowercase, strip plurals and punctuation.
- Match on brand + generic name ("Heinz beans" → "canned beans").
- Quantity units: unify g/kg/ml/l/cans/pcs.
- Unmatched lines → ask the user what they are; never guess silently.

## Expiry / shelf-life
- Flag items with under 3 days shelf life as USE FIRST.
- Flag damaged or wrong-temperature items as RETURN.
- Flag expired items and exclude them from the received count.

## Output checklist
- [ ] Item 1 — received
- [ ] Item 2 — missing (reorder)
- [ ] Item 3 — substituted: X → Y (approve?)
- [ ] Item 4 — expiring (use first)

Then a summary: total lines, received, missing, wrong, value of returns.

## Tool
This workflow is powered by the `receipt-check` plugin tool (OCR + checklist UI). When it's installed, call it with the receipt image and order sheet; otherwise follow the steps manually with the image.
