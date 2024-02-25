import http from "http";
import color from "picocolors";

const { PROJECT_NAME, PORT_HTTP } = process.env;

http
  .createServer((req, res) => {
    res.end("ho");
  })
  .listen(PORT_HTTP);

console.log(
  `${color.red(PROJECT_NAME)} server on ${color.green(
    `http://localhost:${PORT_HTTP}`
  )}`
);
