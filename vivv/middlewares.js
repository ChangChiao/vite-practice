import path from "path";

const ContentTypes = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
};

const getFilePathAndContentType = (filename) => {
  if (filename === "/") {
    filename = "index.html";
  }

  const extname = path.extname(filename).replace(".", "");
  const contentType = ContentTypes[extname] || "text/html";
  const rootPath = process.cwd();
  const filePath = path.join(rootPath, filename);

  return { filePath, contentType };
};

const indexHTMLMiddleware = async (req, res) => {
  const { filePath, contentType } = getFilePathAndContentType(req.url);

  try {
    const file = Bun.file(filePath);
    const content = await file.text();
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("You have to create an index.html");
  }
};

export { indexHTMLMiddleware };
