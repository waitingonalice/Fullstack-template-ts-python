export const getLocalStorage = <T>(key: string) => {
  const item = localStorage.getItem(key);
  if (typeof item === "string" && (item[0] === "{" || item[0] === "[")) {
    return JSON.parse(item) as T;
  }
  return item as T;
};

export const setLocalStorage = (key: string, value: object | string) => {
  if (typeof value === "object") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
