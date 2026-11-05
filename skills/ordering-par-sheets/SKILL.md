---
name: ordering-par-sheets
description: Build order sheets and par levels for a small kitchen cooking 10–15 covers a day, turning a weekly menu into a supplier-ready order. Use when planning food orders, building par sheets, or the user lists a menu and needs quantities to buy.
---

# Ordering & par sheets

## Quick start
1. Collect the menu for the planning period and the cover count per day.
2. Explode every dish into ingredients with quantities (use recipe-scaling-allergens to scale to covers).
3. Aggregate identical ingredients across dishes.
4. Add a waste/overage buffer.
5. Group by supplier category and output an order sheet.

## Covers & aggregation
- total_covers = sum of covers per service/day for the period.
- For each ingredient: amount = Σ (recipe amount × dishes served).
- Convert everything to purchase units (kg, cans, pcs).

## Buffer (waste & safety)
- Fresh produce: +15%.
- Meat/fish: +10%.
- Dairy: +10% (short shelf life — don't over-order).
- Dry goods/cans/frozen: +5% (or round up to the next pack size).

## Par levels (staples)
For 10–15 covers/day, keep a 3–5 day par of non-perishables:
- oil, flour, rice, pasta, canned tomato, salt, sugar, spices, vinegar.

## Order sheet template
| Category | Item | Qty | Unit | Supplier | Notes |
|---|---|---|---|---|---|
| Produce | onions | 5 | kg | ... | |

Group by: Produce / Meat & fish / Dairy & eggs / Dry goods / Frozen / Cleaning.

## Output
- One order sheet (markdown table or CSV) grouped by category.
- A short "must-buy today" list for short shelf-life items.
