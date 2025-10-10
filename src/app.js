import express from "express";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";

//basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
//cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req, res) => {
  res.send("Radhe Krishna");
});

//import the routes
import healthcheckrouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";

//use the routes
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/healthcheck", healthcheckrouter);

export default app;
