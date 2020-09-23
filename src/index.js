import { createElement, render, hydrate } from 'preact';
import App from './App';

import './assets/ionicons.woff'
import './assets/fonts.css'
import './assets/main.css'
import './assets/ionicons.min.css'

const root = document.getElementById('root')
if (root.hasChildNodes()) {
  const cache = window.__PRERENDER_DATA__ ;
  delete window.__PRERENDER_DATA__;
  document.body.removeChild(document.getElementById('data'))
  hydrate(<App cache={cache} />, root);
} else {
  render(<App />, root);
}
