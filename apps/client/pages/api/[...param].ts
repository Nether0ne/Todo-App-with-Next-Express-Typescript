import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { IncomingMessage, ServerResponse } from "http";

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url, body, headers } = req;
  const { authorization } = headers;

  const config = {
    baseURL: process.env.SERVER_URL,
    url,
    method,
    headers: {
      Authorization: authorization || "",
      "Content-Type": "application/json",
    },
    data: body || {},
  } as AxiosRequestConfig;

  try {
    const response = await axios.request(config);
    res.statusCode = response.status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(response.data));
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const { status, statusText } = e.response;
      const { error } = e.response?.data;

      if (error === "UNAUTHORIZED") {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: statusText, error }));
      } else {
        res.statusCode = Number(status) || 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: statusText, error }));
      }
    } else {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
  }
};

export default handler;
