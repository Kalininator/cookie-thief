export function mergeDefaults<T>(defaults: T, options?: Partial<T>): T {
  return {
    ...defaults,
    ...(options || {}),
  };
}

export function assertUnreachable(x: never): never {
  return x;
}
