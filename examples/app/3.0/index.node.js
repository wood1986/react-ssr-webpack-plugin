import {renderToStaticMarkup, renderToString} from "react-dom/server";
import {App} from "./App";
import {ServerStyleSheet} from "styled-components";
import {StaticRouter} from "react-router-dom/server";
import {StatusCodeContext} from "./common";
import {createRef} from "react";

export default async (props = {}) => {
  const sheet = new ServerStyleSheet();
  const statusCode = createRef();
  statusCode.current = 200;

  const div = renderToString(
    sheet.collectStyles(
      <StatusCodeContext.Provider value={statusCode}>
        <StaticRouter location={props.url.path}>
          <App {...props} />
        </StaticRouter>
      </StatusCodeContext.Provider>
    )
  );

  // there is no point to dynamicially change the head at runtime
  // when users share a link, crawler will hit that link again

  const body = "<!DOCTYPE html>" + renderToStaticMarkup(<html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="></link>
      <style dangerouslySetInnerHTML={{"__html": __SOURCES__["index.web.css"]}}></style>
      <script dangerouslySetInnerHTML={{"__html": `globalThis.props = ${JSON.stringify(props).replace(/</g, "\\u003c")}`}} />
      <script dangerouslySetInnerHTML={{"__html": __SOURCES__["index.web.js"]}} />
      {sheet.getStyleElement()}
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{"__html": div}} />
      <script integrity={__DIGESTS__["vendors.js"]} src={`${__webpack_public_path__}${__FILES__["vendors.js"]}`} crossOrigin="anonymous" />
    </body>
  </html>);

  return {
    body,
    "statusCode": statusCode.current,
  };
};
