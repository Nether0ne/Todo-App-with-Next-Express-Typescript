import { setCookie } from "typescript-cookie";

export const setAuthCookies = (token: string) => {
  setCookie("auth", token, {
    secure: true,
    expires: 3,
    sameSite: "Lax",
  });
};
