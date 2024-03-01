import http from "http";
import color from "picocolors";
import connect from "connect";
import chokidar from chokidar;
import { WebSocketServer } from "ws";
import { indexHTMLMiddleware, replaceImportMiddleware } from "./middlewares";
import { getRelativePath } from "./utils";

const { PROJECT_NAME, PORT_HTTP, PORT_WS } = process.env;
const WATCH_LIST = ['index.html','src/*.js', 'src/*.css']

const createWSServer = () => {
  const server = new WebSocketServer({ port: PORT_WS });

  server.on("connection", (ws) => {
    console.log(`${color.green("ws connect")}`);
    ws.send({type: "message", content: `${PROJECT_NAME} Connected`});

    //watcher
    const watcher = chokidar.watcher(WATCH_LIST)
    watcher.on('change', file => {
      const messageObj = {
        type: 'change',
        file: getRelativePath(file),
      }
      ws.send(JSON.stringify(messageObj))
    })

    ws.on("message", (data) => {
      console.log("Received: %s", data);
    });
    ws.on("close", () => {
      console.log("server close");
    });
  });
};

const middleware = connect();
middleware.use(replaceImportMiddleware);
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
