// @ts-ignore
import * as Crypto from "crypto-js";

const SECRET_KEY = "skdjfhkjdsfh";

export const setItem = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, Crypto.AES.encrypt(value, SECRET_KEY).toString());
  }
};

export const getItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    const data: string | null = localStorage.getItem(key);

    return !!data
      ? Crypto.AES.decrypt(data, SECRET_KEY).toString(Crypto.enc.Utf8)
      : null;
  }

  return null;
};

export const clearAll = (): void => {
  localStorage.clear();
};
