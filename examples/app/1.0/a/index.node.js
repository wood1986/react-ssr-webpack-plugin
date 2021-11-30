import {renderToStaticMarkup, renderToString} from "react-dom/server";
import {App} from "./App";
import {ServerStyleSheet} from "styled-components";

export default async (props = {}) => {
  const sheet = new ServerStyleSheet();
  const div = renderToString(
    sheet.collectStyles(
      <App {...props} />
    )
  );

  // there is no point to dynamicially change the head tag at runtime
  // when users share a link, crawler will hit that link again

  const html = "<!DOCTYPE html>" + renderToStaticMarkup(<html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="></link>
      <script dangerouslySetInnerHTML={{"__html": `globalThis.props = ${JSON.stringify(props).replace(/</g, "\\u003c")}`}} />
      {sheet.getStyleElement()}
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{"__html": div}} />
      <script integrity={__DIGESTS__["vendors.js"]} src={__webpack_public_path__ + __FILES__["vendors.js"]} crossOrigin="anonymous" />
      <script integrity={__DIGESTS__["a.web.js"]} src={__webpack_public_path__ + __FILES__["a.web.js"]} crossOrigin="anonymous" />
    </body>
  </html>);

  return html;
};
