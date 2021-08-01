export function mergeDefaults<T>(defaults: T, options?: Partial<T>): T {
  return {
    ...defaults,
    ...(options || {}),
  };
}
