import {renderToStaticMarkup, renderToString} from "react-dom/server";
// eslint-disable-next-line id-length
import {App as B} from "./B";
import {ServerStyleSheet} from "styled-components";

export default async (props = {}) => {
  const sheet = new ServerStyleSheet();
  const div = renderToString(sheet.collectStyles(<B {...props} />));

  // there is no point to dynamicially change the head at runtime
  // when users share a link, crawler will hit that link again

  return "<!DOCTYPE html>" + renderToStaticMarkup(<html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="></link>
      <script dangerouslySetInnerHTML={{"__html": `globalThis.props = ${JSON.stringify(props).replace(/</g, "\\u003c")}`}} />
      <script dangerouslySetInnerHTML={{"__html": __SOURCES__["b.web.js"]}} />
      {sheet.getStyleElement()}
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{"__html": div}} />
      <script integrity={__DIGESTS__["vendors.js"]} src={__webpack_public_path__ + __FILES__["vendors.js"]} crossOrigin="anonymous" />
    </body>
  </html>);
};
