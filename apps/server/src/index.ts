import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "@routes/index";
import HttpException from "@models/http-exception.model";

const app = express();
const port = process.env.PORT;

// App Configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Serves images
app.use(express.static("public"));

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "API is running on /api" });
});

app.use(
  (
    err: Error | HttpException,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    if (err && err.name === "UnauthorizedError") {
      return res.status(401).json({
        status: "error",
        message: "missing authorization credentials",
      });
    } else if (err && "errorCode" in err) {
      res.status(err.errorCode).json(err.message);
    } else if (err) {
      res.status(500).json(err.message);
    }
  },
);

app.listen(port, () => console.log(`Running on port ${port}`));
