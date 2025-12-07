import express from "express";
import cors from "cors";
import spotRouter from "./routes/spotRoutes.js";
import connectDB from "./config/db.js";
import userAuthRouter from "./routes/Authentication/userAuthRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;
connectDB();

app.use("/api/spots", spotRouter);
app.use("/api/auth", userAuthRouter);

app.listen(PORT, () => {
  console.log("listen from", PORT);
});
