const dayjs = require("dayjs");
const logger = require("../logger");

const errorMiddleware = (error, req, res, next) => {
  if (error) {
    logger.error({
      method: req.method,
      path: req.originalUrl,
      body: req.body,
      query: req.query,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Internal server error" });
  }
  return next();
};

const headersMiddleware = (req, res, next) => {
  res.set("X-Api-Version", process.env.APP_VERSION);

  logger.info(
    {
      method: req.method,
      path: req.originalUrl,
      query: req.query,
    },
    "Request"
  );

  return next();
};

const healthMiddleware = (_, res) => {
  return res.status(200).send("OK");
};

const versionMiddleware = (_, res) => {
  return res.json({
    version: APP_VERSION,
    timestamp: dayjs().toISOString(),
    uptime: process.uptime(),
  });
};

const readyMiddleware = (_, res) => {
  return res.status(200).json({
    status: "OK",
    database: "OK",
    timestamp: dayjs().toISOString(),
    uptime: process.uptime(),
  });
};


module.exports = {
  errorMiddleware,
  headersMiddleware,
  healthMiddleware,
  versionMiddleware,
  readyMiddleware,
};
