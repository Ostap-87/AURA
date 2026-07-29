/** Кратчайшее знаковое смещение по кругу — общая математика для 3D-каруселей на главной. */
export function wrappedOffset(index: number, position: number, count: number): number {
  let raw = index - position;
  raw = ((raw % count) + count * 1.5) % count - count / 2;
  return raw;
}
