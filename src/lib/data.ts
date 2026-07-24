import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Category, Consulting, Factory, Tour, TourCost, TourContent, TourDay } from "./schemas";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Файлы в data/*.json генерируются scripts/sync-data.ts (`npm run sync`)
 * и не лежат в git. До первого запуска синка читатели получают пустой
 * список — секции, зависящие от данных, просто не рендерятся.
 */
async function readJson<T>(fileName: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(DATA_DIR, fileName), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export const getFactories = () => readJson<Factory>("factories.json");
export const getCategories = () => readJson<Category>("categories.json");
export const getTours = () => readJson<Tour>("tours.json");
export const getTourDays = () => readJson<TourDay>("tourDays.json");
export const getTourCosts = () => readJson<TourCost>("tourCosts.json");
export const getTourContent = () => readJson<TourContent>("tourContent.json");
export const getConsulting = () => readJson<Consulting>("consulting.json");
