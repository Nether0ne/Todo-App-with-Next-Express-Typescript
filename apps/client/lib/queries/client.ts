import axios, { Axios } from "axios";
import { IncomingMessage } from "http";
import { getAuthCookies } from "@helpers/cookies/getAuthCookies";

const initAxios = (req?: IncomingMessage): Axios => {
  let auth = null;

  if (req) {
    const cookies: Record<string, string> = {};
    if (req.headers.cookie) {
      req.headers.cookie.split(";").map((cookie) => {
        const [key, value] = cookie.trim().split("=");
        cookies[key] = value;
      });
    }
    auth = cookies.auth;
  } else {
    auth = getAuthCookies();
  }

  const fetchOptions = auth
    ? {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }
    : {};

  return axios.create({
    baseURL: process.env.CLIENT_URL,
    ...fetchOptions,
  }) as Axios;
};

export default initAxios;
