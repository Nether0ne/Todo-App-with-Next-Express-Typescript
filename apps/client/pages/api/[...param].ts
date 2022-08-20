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
      if (e.response) {
        const { error } = e.response?.data;
        const statusCode = Number(e.request.res.statusCode) || 500;

        if (error) {
          res.status(statusCode).json({ error, statusCode });
        } else {
          res
            .status(statusCode)
            .json({ error: "Internal Server Error", statusCode });
        }
      } else {
        res
          .status(500)
          .json({ error: "Internal Server Error", statusCode: 500 });
      }
    }
  }
};

export default handler;
