import { createElement } from 'preact';
import renderToString from 'preact-render-to-string';
import prepass from 'preact-ssr-prepass';
import App from './app';
import fetch from 'node-fetch';

global.fetch = fetch;

export default async function prerender(req) {
  const url = req.url;
  console.log('prepassing');
  const data = await prepass(createElement(App, { url, req }));
  console.log('prepassed', data);
  const html = renderToString(createElement(App, { url, req }));
  console.log(html);
  return html
}
