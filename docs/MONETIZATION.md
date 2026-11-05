# Monetization — freemium content pack

## Model
**Free tier** (public, on GitHub): the plugin + 4 tools + 1 lead-magnet skill.
**Paid pack** (Gumroad): the 4 premium skills, delivered as a folder the buyer drops into their DSH skills directory.

## Free vs Paid
| | Free | Paid |
|---|---|---|
| receipt_check / receipt_parse / receipt_ocr / recipe_suggest tools | ✅ | ✅ |
| recipe-scaling-allergens skill | ✅ | ✅ |
| ordering-par-sheets skill | — | ✅ |
| receipt-checking skill | — | ✅ |
| recipe-ideas skill | — | ✅ |
| finnish-food-compliance skill | — | ✅ |
| Updates & support | community | 6 months / monthly |

## Pricing
- Full pack (one-time): **€39**
- Subscription (updates + monthly recipe drops): **€15/mo**

## Delivery (no license key needed — content is the product)
The paid pack is a ZIP of the `premium/` folder. After purchase the buyer unzips it into their DSH skills directory and it auto-loads (DSH watches the skills folder — no restart needed):
- `<project>/.dsh/skills/` (per-workspace) or
- `~/.dsh/skills/` (all workspaces)

## Why content gating, not code DRM
Skills are plain markdown, so there's no strong copy protection for text. The value is: curated, maintained, Finnish-compliant expertise + updates. Sell the pack, not a lock.

## Optional license key (if you later want the plugin itself to gate skills)
1. Create a Gumroad product with `license_keys` enabled.
2. The plugin calls `POST https://api.gumroad.com/v2/licenses/verify` with `product_permalink` + `license_key`.
3. Valid → register all 5 skills; invalid → register only the free skill.
(Implement when you want hard gating; the content-delivery model above needs none.)
