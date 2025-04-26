require("dotenv").config();

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const app = express();
const api = require("./api");
const logger = require("./logger");
const {
  headersMiddleware,
  healthMiddleware,
  versionMiddleware,
  readyMiddleware,
  errorMiddleware,
} = require("./middlewares");

const PORT = process.env.PORT;
const APP_VERSION = process.env.APP_VERSION;
const SWAGGER_URL = process.env.SWAGGER_URL;

app.disable("x-powered-by");

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(headersMiddleware);

app.get("/", (_, res) => res.send("My first API"));

app.get("/healthz", healthMiddleware);
app.get("/version", versionMiddleware);
app.get("/ready", readyMiddleware);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerJSDoc({
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "My first API",
          version: APP_VERSION,
        },
        servers: [
          {
            url: SWAGGER_URL,
          },
        ],
      },
      apis: ["./api/index.js"],
    })
  )
);

app.use("/api/v1", api);

app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`App listen in port ${PORT}`);
});
