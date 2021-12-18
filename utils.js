
/* eslint-disable max-statements */
const {match} = require("path-to-regexp");
const {isPlainObject} = require("is-plain-object");
const path = require("path");

async function ReactSSREntry({require, workdir, props, url, version}) {
  try {
    if (!isPlainObject(props)) {
      return {"statusCode": 500, "body": "reqToProps does not return a plain object"};
    }

    const manifest = `${path.resolve(workdir, version)}.js`;
    delete require.cache[manifest];

    const {
      __ROUTES__,
      __ENTRIES__,
      __VERSION__,
    } = require(manifest);

    const route = __ROUTES__.find(({pattern}) => match(pattern)(url.pathname));
    if (!route) {
      return {"statusCode": 404, "body": `Cannot find a route for ${url.pathname}`};
    }

    const entry = `${route.entry(match(route.pattern)(url.pathname))}.js`;
    if (!__ENTRIES__[entry]) {
      return {"statusCode": 404, "body": `Cannot find the entry '${entry}'`};
    }

    return await require(`${path.resolve(workdir, __ENTRIES__[entry])}`)
      .default({...props, __VERSION__});
  } catch (err) {
    return {"statusCode": 500, "body": err.stack};
  }
}

function ReactSSRResponse(res, result) {
  const {body, statusCode} = result;
  res.writeHead(
    statusCode,
    {
      "Content-Type": body.startsWith("<!DOCTYPE html>") ? "text/html" : "text/plain",
    }
  );
  res.end(body);
  return;
}

module.exports = {
  ReactSSREntry,
  ReactSSRResponse,
};
