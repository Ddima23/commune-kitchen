---
name: recipe-ideas
description: Suggest varied, non-repeating dishes from what is in stock, rotating proteins and styles (red/white fish, beef-mince ragù, chicken ragù, vegetable ragù, dairy dishes). Use when the user lists available products and asks what to cook, or wants a weekly menu without repeats.
---

# Recipe ideas from stock

## Quick start
1. Collect the available products (names, plus optional category).
2. Call the recipe_suggest tool with those products and any recently cooked dishes.
3. Rank by coverage; pick the highest-coverage dish that is not a repeat.
4. Present 2-3 options with what is missing.

## Rules
- Avoid repeating the same dish within a week.
- Rotate protein/family: red fish, white fish, mince ragù, chicken ragù, vegetable ragù, dairy.
- Scale the chosen dish to covers with recipe-scaling-allergens and flag allergens before serving.
- If a top pick is missing 1-2 cheap staples (onion, oil, salt), say so and offer to add them to the order sheet.
