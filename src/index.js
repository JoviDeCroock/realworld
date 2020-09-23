import { createElement, render, hydrate } from 'preact';
import App from './App';

const root = document.getElementById('root')
if (root.hasChildNodes()) {
  const cache = window.__PRERENDER_DATA__;
  delete window.__PRERENDER_DATA__;
  const scriptElement = document.getElementById('data');
  document.head.removeChild(scriptElement);
  hydrate(<App cache={cache} />, root);
} else {
  render(<App />, root);
}
