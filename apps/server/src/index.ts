import dotenv from "dotenv";
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env"
      : `.env.${process.env.NODE_ENV}`,
});
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "@routes/index";
import HttpException from "@models/misc/http-exception.model";

const app = express();
const port = process.env.PORT;

// App Configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Serves static files
app.use(express.static("public"));

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "API is running on /api" });
});

app.use(
  (
    err: Error | HttpException,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof HttpException) {
      if (err && err.name === "UnauthorizedError") {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      } else {
        res.status(err.errorCode).json({ error: err.message });
      }
    } else {
      res.status(500).json({ error: err.message });
    }
  }
);

export default app.listen(port);
