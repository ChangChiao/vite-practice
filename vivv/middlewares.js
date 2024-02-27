import { getFilePathAndContentType } from "./utils";
import path from "path";

const ExcludeList = ["/vivv/client.js"];

const replaceImportMiddleware = async (req, res, next) => {
  const { url } = req;
  if (url.endsWith(".js") && !ExcludeList.includes(url)) {
    const { filePath, contentType } = getFilePathAndContentType(url);
    const file = Bun.file(filePath);
    let content = await file.text();

    const regex = /from ['"](?!\.\/)([^'"]+)['"]/g;

    //pre-bundling
    const matches = content.match(regex);
    if (matches) {
      const mod_regex = /['"](?!\.\/)([^'"]+)['"]/;
      const modules = matches
        .map((m) => {
          return m.match(mod_regex)[1];
        })
        .map(getEntryPoint);
      Bun.build({
        entryPoint: modules.map((m) => `./node_modules/${m}`),
        outdir: "./node_modules/.vivv/deps",
      });
    }

    content = content.replace(regex, (match, capture) => {
      const entryPoint = getEntryPoint(capture);
      return `from "./node_modules/.vivv/deps/${entryPoint}"`;
    });
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  }
  next();
};

const indexHTMLMiddleware = async (req, res) => {
  const { filePath, contentType } = getFilePathAndContentType(req.url);

  try {
    const file = Bun.file(filePath);
    let content = await file.text();

    if (path.basename(filePath) === "index.html") {
      const regex = /(<head>)([\s\S]*?<\/head>)/i;
      const match = content.match(regex);
      const clientScript = "<script src='vivv/client.js'></script>";

      if (match) {
        content = content.replace(match[0], match[1] + clientScript + match[2]);
      }
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("You have to create an index.html");
  }
};

export { indexHTMLMiddleware, replaceImportMiddleware };
