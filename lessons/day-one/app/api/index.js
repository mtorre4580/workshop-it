const express = require("express");
const logger = require("../logger");
const { getUsers } = require("./services/users");
const { resolveDomain } = require("./services/dns");

const apiRouter = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Returns a list of users
 *     parameters:
 *       - in: query
 *         name: flaky
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, simulates random status codes for testing purposes
 *     responses:
 *       200:
 *         description: Users response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   avatar:
 *                     type: string
 */
apiRouter.get("/users", (req, res) => {
  const { flaky } = req.query;

  const isFlaky = flaky === "true";

  if (isFlaky) {
    const statusCodes = [200, 400, 401, 403, 404, 500, 502, 503];

    const randomStatus =
      statusCodes[Math.floor(Math.random() * statusCodes.length)];

    const messages = {
      400: "Invalid params, please check",
      401: "You don't have access",
      403: "You don't have access",
      404: null,
      500: "Our engineers are working...",
      502: "Our engineers are working...",
      503: "Our engineers are working...",
    };

    const message = messages[randomStatus];

    if (randomStatus === 200) {
      return res.status(randomStatus).json(getUsers());
    }

    if (message === null) {
      return res.sendStatus(randomStatus);
    }

    return res.status(randomStatus).json({ message });
  }

  return res.set("Cache-Control", "public, max-age=1000").json(getUsers());
});

/**
 * @swagger
 * /api/v1/dns:
 *   get:
 *     summary: Returns info about the domain
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         required: true
 *         description: The domain name to resolve (e.g. google.com)
 *     responses:
 *       200:
 *         description: DNS response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 domain:
 *                   type: string
 *                 addresses:
 *                   type: array
 *                   items:
 *                     type: string
 */
apiRouter.get("/dns", async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res
      .status(400)
      .json({ message: "Query param 'domain' is required" });
  }

  try {
    const addresses = await resolveDomain(domain);
    return res.json({ domain, addresses });
  } catch (error) {
    logger.error(
      {
        method: req.method,
        path: req.originalUrl,
        body: req.body,
        query: req.query,
        error: error.message,
        stack: error.stack,
      },
      "DNS resolution failed"
    );
    return res.status(500).json({ message: "DNS resolution failed" });
  }
});

module.exports = apiRouter;
