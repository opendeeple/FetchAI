export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    if (key in result) {
      delete result[key as keyof typeof result];
    }
  });
  return result as Omit<T, K>;
}

export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  const minLength = Math.min(arr1.length, arr2.length);
  const result: [T, U][] = [];

  for (let i = 0; i < minLength; i++) {
    result.push([arr1[i], arr2[i]]);
  }

  return result;
}
