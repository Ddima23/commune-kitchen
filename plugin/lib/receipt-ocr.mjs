// Standalone receipt OCR: preprocess a photo, then Tesseract. Opt-in module.
// Requires dependencies: jimp, tesseract.js (see OCR.md).
import { Jimp } from 'jimp';
import { createWorker } from 'tesseract.js';

/**
 * Preprocess a receipt photo and return OCR text.
 * @param {string|Buffer} input - image path or buffer.
 * @param {{langs?: string, threshold?: number}} opts
 * @returns {Promise<{text: string, confidence: number}>}
 */
export async function ocrReceipt(input, { langs = 'eng', threshold } = {}) {
  const img = await Jimp.read(input);
  img.greyscale().normalize().scale(2);
  if (threshold !== undefined) img.threshold({ max: threshold });
  const buf = await img.getBuffer('image/png');
  const worker = await createWorker(langs);
  try {
    const { data } = await worker.recognize(buf);
    return { text: data.text, confidence: data.confidence };
  } finally {
    await worker.terminate();
  }
}
