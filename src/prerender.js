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
        <link
          rel="icon"
          href="data:image/svg+xml,<svg width='64' height='64' xmlns='http://www.w3.org/2000/svg'><path fill='%235cb85c' d='M49 32L21 5l-6 5 23 22-23 22 6 5 28-27z'/></svg>"
        />
        <link
          rel="preload"
          as="font"
          href="/ionicons.woff"
          type="font/woff"
          crossorigin
        />
        <link rel="stylesheet" href="/ionicons.min.css" />
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
