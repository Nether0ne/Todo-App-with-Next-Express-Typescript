import { Request } from "express";
import { expressjwt, TokenGetter } from "express-jwt";

const getTokenFromHeaders: TokenGetter = (
  req: Request,
): string | Promise<string> | undefined => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return undefined;
};

const auth = {
  required: expressjwt({
    secret: process.env.JWT_SECRET || "superSecret",
    getToken: getTokenFromHeaders,
    algorithms: ["HS256"],
  }),
  optional: expressjwt({
    secret: process.env.JWT_SECRET || "superSecret",
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    algorithms: ["HS256"],
  }),
};

export default auth;
