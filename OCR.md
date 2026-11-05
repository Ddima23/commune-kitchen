# Receipt OCR — strategy & findings

## What we tested
- Attached-receipt vision is NOT available on the default model (deepseek-v4-pro does not declare image input), so the agent cannot "look" at a photo itself.
- Plain Tesseract on a casual receipt photo = garbage (confidence ~42, gibberish).
- Tesseract + light preprocessing (greyscale → normalize → 2× upscale) = usable: it extracted the store name, item names, prices and total from a real photo (confidence ~47).

Sample extraction (Hofer/Austria receipt photo):

    HOFER KG Karl-Popper-Straße 2 1100 Wien
    Schnitzelsort 5.99 | Roulade 400 2.15 | BIO OVALTOMATEN 2.19
    Naturjoghurt 1.99 | Vollmilch 1.30
    Total EUR 22.41 | Visa EUR 22.41 | 9 Artikel

## The pipeline (photo → checklist)
1. photo → `receipt_ocr` (preprocess + Tesseract) → text
2. text → `receipt_parse` → structured items
3. items → `receipt_check` → tick-off checklist

## Two paths
| Path | Accuracy | Cost | Notes |
|---|---|---|---|
| Local Tesseract + preprocessing | medium (~47 conf on a hard photo; better on flat scans) | free, offline | built in, needs eng+fin+swe traineddata |
| Cloud OCR / vision API | high | per-call | the premium SaaS option (monetization model #4) |

## Recommendation
Ship **local Tesseract as the default** (works offline, no key) and offer **cloud OCR as the premium upgrade** for hard/faint receipts. The deterministic matching (receipt_parse → receipt_check) is identical on both paths.

## Integration
`plugin/lib/receipt-ocr.mjs` exports `ocrReceipt(input, { langs, threshold })`. Add `jimp` + `tesseract.js` to `plugin/package.json` dependencies to enable the `receipt_ocr` tool. Keep it opt-in so the core plugin stays lightweight.
