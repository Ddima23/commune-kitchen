#!/usr/bin/env python3
"""Scale a recipe JSON to a target number of covers and flag allergens.

Recipe JSON format:
{
  "name": "Chili con carne",
  "base_covers": 10,
  "ingredients": [
    {"name": "ground beef", "amount": 2.5, "unit": "kg", "allergens": []},
    {"name": "butter", "amount": 100, "unit": "g", "allergens": ["milk"]}
  ]
}

Usage:
  python scale_recipe.py recipe.json --people 15
  python scale_recipe.py recipe.json --people 12 --exclude milk,gluten
  python scale_recipe.py --demo
"""
import argparse, json, math, sys

MAJOR_ALLERGENS = {
    "milk", "eggs", "fish", "shellfish", "tree nuts", "peanuts", "wheat",
    "gluten", "soy", "sesame", "celery", "mustard", "lupin", "molluscs",
    "sulphites",
}

DEMO = {
    "name": "Chili con carne",
    "base_covers": 10,
    "ingredients": [
        {"name": "ground beef", "amount": 2.5, "unit": "kg", "allergens": []},
        {"name": "onion", "amount": 4, "unit": "pcs", "allergens": []},
        {"name": "canned tomatoes", "amount": 3, "unit": "can (400g)", "allergens": []},
        {"name": "kidney beans", "amount": 4, "unit": "can (400g)", "allergens": []},
        {"name": "butter", "amount": 100, "unit": "g", "allergens": ["milk"]},
        {"name": "wheat flour", "amount": 50, "unit": "g", "allergens": ["gluten", "wheat"]},
    ],
}


COUNTABLE_UNITS = ("pcs", "pc", "can", "bottle", "jar", "pack", "box", "head", "stalk", "egg", "clove", "bunch")

def is_countable(unit):
    u = (unit or "").lower().strip()
    forms = [u]
    if u.endswith("s") and len(u) > 1:
        forms.append(u[:-1])
    for c in COUNTABLE_UNITS:
        for f in forms:
            if f == c or f.startswith(c + " ") or f.startswith(c + "("):
                return True
    return False

def round_amount(a, unit=None):
    if unit and is_countable(unit):
        return math.ceil(a)
    if a < 5:
        return round(a * 2) / 2
    if a <= 250:
        return round(a / 5) * 5
    return round(a / 25) * 25


def fmt(a):
    return f"{a:g}"


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("recipe", nargs="?", help="recipe JSON file")
    ap.add_argument("--people", type=float, required=False, help="target covers")
    ap.add_argument("--exclude", default="", help="comma-separated allergens to substitute")
    ap.add_argument("--demo", action="store_true", help="print a demo recipe scaled to --people")
    args = ap.parse_args()

    if args.demo:
        recipe = DEMO
        args.people = args.people or 15
    else:
        if not args.recipe:
            ap.error("recipe file required (or use --demo)")
        with open(args.recipe, encoding="utf-8") as f:
            recipe = json.load(f)

    if not args.people:
        ap.error("--people is required")

    base = float(recipe.get("base_covers") or 1)
    people = float(args.people)
    factor = people / base
    exclude = {a.strip().lower() for a in args.exclude.split(",") if a.strip()}

    print(f"## {recipe['name']} — scaled to {fmt(people)} covers (factor {factor:.2f})")
    print()
    print("| Ingredient | Amount | Unit | Allergens |")
    print("|---|---|---|---|")
    for ing in recipe["ingredients"]:
        amt = round_amount(float(ing["amount"]) * factor, ing.get("unit"))
        al = ing.get("allergens") or []
        alstr = ", ".join(al) if al else "—"
        flag = ""
        if exclude:
            hit = [a for a in al if a.lower() in exclude]
            if hit:
                flag = f"  !! substitute ({', '.join(hit)})"
        print(f"| {ing['name']} | {fmt(amt)} | {ing['unit']} | {alstr}{flag} |")

    present = sorted({a.lower() for ing in recipe["ingredients"] for a in (ing.get("allergens") or [])})
    if present:
        print()
        print("Allergens present: " + ", ".join(present))
    if exclude:
        print("Excluded and flagged: " + ", ".join(sorted(exclude)))


if __name__ == "__main__":
    main()
