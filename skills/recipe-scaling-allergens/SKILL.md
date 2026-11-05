---
name: recipe-scaling-allergens
description: Scale a recipe to any number of servings, convert units, and adapt dishes for the 14 major food allergens. Use when the user gives a recipe and a headcount, asks to cook for N people, or asks about allergy-safe substitutions.
---

# Recipe scaling & allergens

## Quick start
1. Read the recipe and its base yield (covers/servings).
2. Multiply every ingredient by (target covers / base covers).
3. Round like a cook, not a calculator (see Rounding).
4. If an allergen is excluded, substitute (see Allergen matrix).
5. Output the scaled recipe table.

## Scaling
scale_factor = target_covers / base_covers

- Liquids, dry goods, produce: multiply exactly.
- Eggs: round to whole eggs; adjust liquid slightly if needed.
- Salt, pepper, spices, herbs: do NOT scale linearly — start at ~50–70% of the linear amount, taste, adjust.
- Leavening (baking powder, yeast): scale linearly.
- Water for rice/pasta/stock: scale approximately, adjust during cooking.

## Rounding
- Under 5 g/ml: round to nearest 0.5.
- 5–250 g/ml: round to nearest 5.
- Over 250 g/ml: round to nearest 25.
- Countable (eggs, onions, lemons): round up to whole pieces.

## Unit conversions
- 1 cup = 240 ml; 1 tbsp = 15 ml; 1 tsp = 5 ml.
- 1 oz = 28 g; 1 lb = 454 g.
- 1 kg = 2.2 lb.

## Trim & cook loss
Account for yield when buying:
- Onions/garlic/root veg: ~10% trim loss.
- Leafy greens, herbs: ~25%.
- Meat on the bone: ~30% bone/skin loss.
- Cooked meat: ~20–25% shrinkage.

Buy the scaled amount ÷ (1 − loss).

## Allergen matrix (14 major allergens)
| Allergen | Common in | Substitutes |
|---|---|---|
| Milk | butter, cream, cheese, whey | oat/soy milk, oil + plant milk, vegan cheese |
| Eggs | mayo, pasta, batters | flax egg, aquafaba, silken tofu |
| Gluten (wheat) | flour, bread, soy sauce, pasta | GF flour blend, tamari, rice noodles |
| Peanuts | peanut butter, satay | sunflower butter, tahini |
| Tree nuts | almonds, cashews, pesto | seeds, roasted chickpeas |
| Soy | soy sauce, tofu, edamame | tamari (for gluten), coconut aminos |
| Fish | anchovies, fish sauce | seaweed + salt, miso |
| Shellfish | shrimp, oyster sauce | mushrooms, kombu |
| Sesame | tahini, sesame oil, breads | neutral oil, sunflower butter |
| Celery | mirepoix, stock | leek/fennel + salt |
| Mustard | mustard, mayo | vinegar + turmeric |
| Lupin | some flours/breads | another flour |
| Molluscs | mussels, squid | (rare in home recipes) |
| Sulphites | dried fruit, wine, vinegar | fresh fruit, lemon juice |

## Output format
```
## [Dish] for N covers
| Ingredient | Amount | Unit | Notes |
|---|---|---|---|
| ... | ... | ... | ... |

Allergens present: milk, gluten, ...
Substitutions applied: milk → oat milk
```

## Calculator
Run the bundled scaler for a precise table:

    python scripts/scale_recipe.py recipe.json --people 15 --exclude milk,gluten
