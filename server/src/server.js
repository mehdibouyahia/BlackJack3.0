import express from "express";
import http from "http";
import { GameSocket } from "./GameSocket.js";

const app = express();
const httpServer = http.createServer(app);

const socket = new GameSocket(httpServer);

app.get("/", (_, res) => {
  res.status(200).json(socket.tables);
});

app.use((_, res) => {
  const error = new Error("Not found!");
  res.status(404).json({ message: error.message });
});

httpServer.listen(5000, () => console.info("Server is running on port 5000"));
