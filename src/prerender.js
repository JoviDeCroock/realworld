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
  const html = renderToString(createElement(App, { url, req, cache }));

  const serializedCache = serialize(cache);

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Preact-Realworld-Modern</title>
        <link rel="stylesheet" href="/${css}" />
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/${entry}"></script>
        <script id="data">
          window.__PRERENDER_DATA__ = ${serializedCache}
        </script>
      </body>
    </html>
  `;
}
