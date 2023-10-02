export type Class<T = never> =
  | (new (...args: never[]) => T)
  | (abstract new (...args: never[]) => T);
