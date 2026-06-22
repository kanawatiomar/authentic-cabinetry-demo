import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
  const requestPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const cleanPath = normalize(requestPath || "index.html").replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(root, cleanPath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1");
