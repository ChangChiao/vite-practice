import http from "http";
import color from "picocolors";

http
  .createServer((req, res) => {
    res.end("ho");
  })
  .listen(5173);

console.log(`${color.red("hihi")} server on`);
