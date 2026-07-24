/**
 * Расчёт окупаемости для экрана результата квиза (PROJECT.md 5.6).
 * `сотрудники × ФОТ × 12 × 1.3` — текущие годовые затраты с учётом
 * налогов и взносов (коэффициент 1.3). Стоимость решения — середина
 * вилки цены категории. Экономия в год = текущие затраты (робот
 * замещает труд полностью в этой упрощённой модели). Срок окупаемости
 * в месяцах = стоимость решения / (экономия за год / 12).
 */
export type QuizCalc = {
  currentAnnualCost: number;
  solutionCost: number;
  annualSavings: number;
  paybackMonths: number | null;
};

export function calculatePayback(
  employees: number,
  monthlySalary: number,
  priceMin: number,
  priceMax: number,
): QuizCalc {
  const currentAnnualCost = employees * monthlySalary * 12 * 1.3;
  const solutionCost = (priceMin + priceMax) / 2;
  const annualSavings = currentAnnualCost;
  const monthlySavings = annualSavings / 12;
  const paybackMonths = monthlySavings > 0 ? solutionCost / monthlySavings : null;

  return { currentAnnualCost, solutionCost, annualSavings, paybackMonths };
}
