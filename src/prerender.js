import { createElement } from 'preact';
import renderToString from 'preact-render-to-string';
import prepass from 'preact-ssr-prepass';
import App from './app';
import fetch from 'node-fetch';

global.fetch = fetch;

export default async function prerender(req) {
  const url = req.url;
  const cache = {};
  await prepass(createElement(App, { url, req, cache }));
  const html = renderToString(createElement(App, { url, req, cache }));
  return html
}
