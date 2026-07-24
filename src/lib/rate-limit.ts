/**
 * Ограничение частоты по адресу (PROJECT.md, раздел 11). Хранилище в памяти
 * процесса — достаточно для одного инстанса; при горизонтальном масштабировании
 * меняется только этот модуль.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 1000) {
    for (const [k, timestamps] of hits) {
      if (timestamps.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}
