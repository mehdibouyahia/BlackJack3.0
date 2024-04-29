import express from "express";
import http from "http";
import { GameSocket } from "./GameSocket.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserRouter } from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/auth", UserRouter);

// mongoose.connect("mongodb://localhost:27017/authentfication");
mongoose.connect(
  "mongodb+srv://blackjack:hwyon2QysbJCf2Sl@blackjackv03.gqtn4wb.mongodb.net/auth?retryWrites=true&w=majority&appName=BLACKJACKV03"
);

const socket = new GameSocket(httpServer);

app.get("/", (_, res) => {
  res.status(200).json(socket.tables);
});

app.use((_, res) => {
  const error = new Error("Not found!");
  res.status(404).json({ message: error.message });
});

httpServer.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
