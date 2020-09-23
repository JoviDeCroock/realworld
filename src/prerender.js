import { createElement } from 'preact';
import renderToString from 'preact-render-to-string';
import prepass from 'preact-ssr-prepass';
import App from './App';
import fetch from 'node-fetch';
import serialize from 'serialize-javascript';

global.fetch = fetch;

export default async function prerender(req, entry, css) {
  const url = req.url;
  const cache = {};
  await prepass(createElement(App, { url, req, cache }));
  const stringifiedDom = renderToString(createElement(App, { url, req, cache }));

  const serializedCache = serialize(cache);

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Preact-Realworld-Modern</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preload" as="style" href="/${css}" />
        <link rel="stylesheet" href="/${css}" />
        <link rel="font" href="/ionicons.woff" type="font/woff" />
        <script id="data">
          window.__PRERENDER_DATA__ = ${serializedCache}
        </script>
      </head>
      <body>
        <div id="root">${stringifiedDom}</div>
        <script defer src="/${entry}"></script>
      </body>
    </html>
  `;
}
