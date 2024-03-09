import isNil from "lodash/isNil";

export const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const removeNulls = <S>(value: S | null): value is S => value != null;

/** Recursive function that finds a key and returns its respective value in a deeply nested object  */
export const findKey = (
  targetKey: string,
  object: Record<string, any>,
): unknown | unknown[] | undefined => {
  if (!object) return undefined;
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (key === targetKey) {
      return object[key];
    }
    if (typeof object[key] === "object") {
      const result = findKey(targetKey, object[key]);
      return result;
    }
  }
  return undefined;
};

export const reverseObject = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

export const isPrimitive = <T>(o: T) => {
  switch (typeof o) {
    case "object": {
      return false;
    }
    case "function": {
      return false;
    }
    default: {
      return true;
    }
  }
};
export const isFunction = <T>(o: T) => typeof o === "function";

/**
 * @returns This function will return a value that is of the same type as its arguments.
 * @example ```getChanges({a: 1}, {a: 2}) // returns 2```
 * @example ```getChanges([1, 2, 3], [1, 2, 4]) // returns [4]```
 * @example ```getChanges({a: 1}, {a: 2, b: 3}) // returns {a: 2, b: 3}```
 */
export const getChanges = <T>(prev: T, current: T): T => {
  if (isNil(prev) || isNil(current) || isFunction(current) || isFunction(prev))
    throw new Error("Invalid arguments");

  // if both are primitives
  if (isPrimitive(prev) && isPrimitive(current)) {
    if (prev === current) {
      return "" as T;
    }
    return current;
  }
  // if both are arrays
  if (Array.isArray(prev) && Array.isArray(current)) {
    const changes: unknown[] = [];
    if (JSON.stringify(prev) === JSON.stringify(current)) {
      return changes as T;
    }
    current.forEach((item, index) => {
      if (JSON.stringify(prev[index]) !== JSON.stringify(item)) {
        changes.push(item);
      }
    });
    return changes as T;
  }

  // if both are objects
  const diff = getChanges(
    Object.entries(prev as object),
    Object.entries(current as object),
  ) as [string, unknown][];
  const appendChanges = diff.reduce(
    (merged, [key, value]) => ({
      ...merged,
      [key]: value,
    }),
    {} as T,
  );
  return appendChanges;
};

export const objectify = <T>(arr: T[], key?: keyof T) => {
  const obj: Record<string, T> = {};
  arr.forEach((item) => {
    if (key) {
      obj[item[key] as unknown as string] = item;
    } else {
      obj[item as unknown as string] = item;
    }
  });
  return obj;
};

export const generateOptions = <T extends Record<string, string>>(arg: T) => {
  const options = Object.entries(arg).map(([key, value]) => ({
    label: value,
    value: key,
  }));
  return options;
};

export const getDomain = (hostname: string) =>
  hostname.split(".").reverse().slice(0, 2).reverse().join(".");
