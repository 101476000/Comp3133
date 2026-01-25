const serverless = require('serverless-http');
const { createExpressApp } = require('../src/app');

let cachedHandlerPromise;

module.exports = async (req, res) => {
  if (!cachedHandlerPromise) {
    cachedHandlerPromise = (async () => {
      const app = await createExpressApp();
      return serverless(app);
    })();
  }
  const handler = await cachedHandlerPromise;
  return handler(req, res);
};
