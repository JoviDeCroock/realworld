import { createElement, render, hydrate } from 'preact';
import App from './App';

// This adds logging on the client to show that we are
// not doing any dom-mutations in deferred hydration.
// if (typeof window !== 'undefined') {
//   window.mutations = [];
//   window.nativeMutations = [];

//   const serialize = val => {
//     if (val instanceof NodeList) return [].map.call(val, serialize);
//     if (val instanceof Node) {
//       if (val.splitText) return val;
//       return val.outerHTML.match(/.*?>/)[0];
//     }
//     if (Array.isArray(val)) return val.map(serialize);
//     if (val != null && typeof val == 'object') {
//       let node = {};
//       for (let i in val) node[i] = serialize(val[i]);
//       return node;
//     }
//     return val;
//   };

//   const observer = new MutationObserver(records => {
//     for (let mutation of records) {
//       const m = serialize(mutation);
//       for (let i in m)
//         if (m[i] == null || (Array.isArray(m[i]) && !m[i].length)) delete m[i];
//       window.mutations.push(m);
//       window.nativeMutations.push(mutation);
//     }
//   });

//   observer.observe(document.body, {
//     attributes: true,
//     childList: true,
//     subtree: true,
//   });
// }

const root = document.getElementById('root');
if (root.hasChildNodes()) {
  const cache = window.__PRERENDER_DATA__;
  delete window.__PRERENDER_DATA__;
  const scriptElement = document.getElementById('data');
  document.head.removeChild(scriptElement);
  hydrate(<App cache={cache} />, root);
} else {
  render(<App />, root);
}
