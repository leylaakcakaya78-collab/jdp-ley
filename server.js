import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const BLOCKED_PATHS = new Set([
  "/server.js",
  "/package.json",
  "/package-lock.json",
  "/.env",
  "/.env.example"
]);

app.use((req, res, next) => {
  if (BLOCKED_PATHS.has(req.path) || req.path.startsWith("/node_modules")) {
    return res.status(404).end();
  }
  next();
});

app.use(
  express.static(__dirname, {
    index: "index.html",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".webmanifest")) {
        res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
      }
    }
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
