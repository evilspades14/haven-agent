
export function categoryValuestoCategoryParam<T extends Record<string, boolean>>(
  values: Array<keyof T>,
): T {
  let categories = {} as T;
  values.forEach((val) => {
    categories[val] = true as T[keyof T];
  });
  return categories;
}

export function objParamToArray<T extends Record<string, boolean>>(
  obj: T,
): Array<keyof T & string> {
  return (Object.keys(obj) as Array<keyof T & string>).filter(
    (key) => obj[key],
  );
}