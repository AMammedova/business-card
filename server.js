import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = process.env.PORT || 6003;
const hostname = "0.0.0.0";

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
