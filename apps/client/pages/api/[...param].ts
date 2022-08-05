import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
    res.status(response.status).json(response.data);
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const { error, status } = e.response?.data;

      if (error) {
        res.statusMessage = error;
        if (error === "UNAUTHORIZED") {
          res.status(401).json({ message: error, status });
        } else {
          res.status(Number(status)).json({ message: error, status });
        }
      } else {
        res.status(500).json({ message: "Internal Server Error", status });
      }
    }
  }
};

export default handler;
