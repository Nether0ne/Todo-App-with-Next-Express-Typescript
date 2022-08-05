import { getCookie } from "typescript-cookie";

export const getAuthCookies = (): string => {
  return getCookie("auth") as string;
};
