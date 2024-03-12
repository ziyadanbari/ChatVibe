import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import { connectToDB } from "./lib/mongodb.js";
import { Server } from "socket.io";
import { auth } from "./router/authentication.route.js";
import { cors } from "hono/cors";
import { privateRoute } from "./router/private.route.js";
import { handleSocket } from "./router/socket.private.route.js";
import { socketInstance } from "./models/socketInstance.js";
import { isAborted } from "zod";

dotenv.config();

const { PORT, DB_URI } = process.env;
const app = new Hono({});
const apiRoutes = app.basePath("/api");

app.use(
  "*",
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
apiRoutes.route("/auth", auth);
apiRoutes.route("/private", privateRoute);

connectToDB(DB_URI)
  .then((_) => {
    console.log("Connected to database!");
    const server = serve({ fetch: app.fetch, port: PORT }, (server) => {
      console.log(
        `Server listening on ${server.address}:${server.port || PORT}`
      );
    });
    global.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
      },
    });
    handleSocket(io);
    process.on("exit", cleanSocketInstances);
  })
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
async function cleanSocketInstances() {
  await socketInstance.deleteMany({});
}
