import http from "http";
import color from "picocolors";
import connect from "connect";
import { indexHTMLMiddleware } from "./middlewares";

const middleware = connect();

const { PROJECT_NAME, PORT_HTTP } = process.env;

middleware.use(indexHTMLMiddleware);
const createServer = () => {
  http.createServer(middleware).listen(PORT_HTTP);

  console.log(
    `${color.red(PROJECT_NAME)} server on ${color.green(
      `http://localhost:${PORT_HTTP}`
    )}`
  );
};

export { createServer };
