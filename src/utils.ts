
export function oneOf<T>(l: Array<T>): T {
  return l[Math.floor(Math.random() * l.length)];
}

export function between(min: number, max: number): number {
  const length = max - min;
  return Math.random() * length + min;
}
