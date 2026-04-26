import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { attachCurrentUser } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(attachCurrentUser);

app.get("/", (_req, res) => {
  res.json({
    name: "English4U API",
    version: "0.1.0"
  });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
