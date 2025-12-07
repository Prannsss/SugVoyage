import express from "express";
import cors from "cors";
import spotRouter from "./routes/spotRoutes.js";
import connectDB from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;
connectDB();

app.use("/api/spots", spotRouter);

app.listen(PORT, () => {
  console.log("listen from", PORT);
});
