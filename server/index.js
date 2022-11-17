// config
import "./config/config.js";

// modules - import
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

// files - import
import Router from "./routes.js";

// setup
const app = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });

// middlewares
app.use(cors());
app.use(express.json());
app.use(Router);

// listen
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log("Listening on PORT: " + PORT));
