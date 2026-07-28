/**
 * Тянет CSV по ссылкам публикации Google Sheets (переменные окружения ниже).
 * Пока ссылка не задана, использует локальный снимок в data/source/ —
 * тот же формат, так что подключение реальной таблицы не потребует правок кода.
 *
 * Битая строка не роняет сборку: она логируется и пропускается (PROJECT.md, раздел 3).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { parseCsv } from "../src/lib/csv";
import {
  caseRowSchema,
  categoryRowSchema,
  consultingRowSchema,
  factoryRowSchema,
  modelRowSchema,
  tourCostRowSchema,
  tourContentRowSchema,
  tourDayRowSchema,
  tourRowSchema,
} from "../src/lib/schemas";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = path.join(ROOT, "data", "source");
const OUTPUT_DIR = path.join(ROOT, "data");

type Sheet = {
  name: string;
  envVar: string;
  localFile: string;
  outputFile: string;
  rowSchema: z.ZodTypeAny;
};

const sheets: Sheet[] = [
  { name: "factories", envVar: "GOOGLE_SHEETS_CSV_FACTORIES", localFile: "factories.csv", outputFile: "factories.json", rowSchema: factoryRowSchema },
  { name: "models", envVar: "GOOGLE_SHEETS_CSV_MODELS", localFile: "models.csv", outputFile: "models.json", rowSchema: modelRowSchema },
  { name: "categories", envVar: "GOOGLE_SHEETS_CSV_CATEGORIES", localFile: "categories.csv", outputFile: "categories.json", rowSchema: categoryRowSchema },
  { name: "tours", envVar: "GOOGLE_SHEETS_CSV_TOURS", localFile: "tours.csv", outputFile: "tours.json", rowSchema: tourRowSchema },
  { name: "tour_days", envVar: "GOOGLE_SHEETS_CSV_TOUR_DAYS", localFile: "tour_days.csv", outputFile: "tourDays.json", rowSchema: tourDayRowSchema },
  { name: "tour_costs", envVar: "GOOGLE_SHEETS_CSV_TOUR_COSTS", localFile: "tour_costs.csv", outputFile: "tourCosts.json", rowSchema: tourCostRowSchema },
  { name: "tour_content", envVar: "GOOGLE_SHEETS_CSV_TOUR_CONTENT", localFile: "tour_content.csv", outputFile: "tourContent.json", rowSchema: tourContentRowSchema },
  { name: "consulting", envVar: "GOOGLE_SHEETS_CSV_CONSULTING", localFile: "consulting.csv", outputFile: "consulting.json", rowSchema: consultingRowSchema },
  { name: "cases", envVar: "GOOGLE_SHEETS_CSV_CASES", localFile: "cases.csv", outputFile: "cases.json", rowSchema: caseRowSchema },
];

async function loadCsvText(sheet: Sheet): Promise<string> {
  const publishedUrl = process.env[sheet.envVar];
  if (publishedUrl) {
    const response = await fetch(publishedUrl);
    if (!response.ok) {
      throw new Error(`${sheet.name}: failed to fetch ${sheet.envVar} (${response.status})`);
    }
    return response.text();
  }
  return readFile(path.join(SOURCE_DIR, sheet.localFile), "utf-8");
}

async function syncSheet(sheet: Sheet): Promise<void> {
  const csvText = await loadCsvText(sheet);
  const rawRows = parseCsv(csvText);

  const validRows: unknown[] = [];
  let skipped = 0;

  rawRows.forEach((row, index) => {
    const result = sheet.rowSchema.safeParse(row);
    if (result.success) {
      validRows.push(result.data);
    } else {
      skipped++;
      const rowLabel = row.id ?? row.tourId ?? `#${index + 2}`;
      const issues = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
      console.warn(`[sync-data] ${sheet.name} row ${rowLabel} skipped — ${issues}`);
    }
  });

  await writeFile(
    path.join(OUTPUT_DIR, sheet.outputFile),
    JSON.stringify(validRows, null, 2) + "\n",
    "utf-8",
  );

  console.log(`[sync-data] ${sheet.name}: ${validRows.length} valid, ${skipped} skipped`);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const sheet of sheets) {
    await syncSheet(sheet);
  }
}

main().catch((error) => {
  console.error("[sync-data] failed:", error);
  process.exit(1);
});
