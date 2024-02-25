import http from "http";
import color from "picocolors";
import connect from "connect";
import { WebSocketServer } from "ws";
import { indexHTMLMiddleware } from "./middlewares";

const { PROJECT_NAME, PORT_HTTP, PORT_WS } = process.env;

const createWSServer = () => {
  const server = new WebSocketServer({ port: PORT_WS });
  server.on("connection", (ws) => {
    console.log(`${color.green("ws connect")}`);
    ws.on("message", (data) => {
      console.log("Received: %s", data);
    });
  });
};

const middleware = connect();
middleware.use(indexHTMLMiddleware);
const createServer = () => {
  http.createServer(middleware).listen(PORT_HTTP);

  createWSServer();

  console.log(
    `${color.red(PROJECT_NAME)} server on ${color.green(
      `http://localhost:${PORT_HTTP}`
    )}`
  );
};

export { createServer };
