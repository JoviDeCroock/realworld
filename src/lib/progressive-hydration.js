import { h } from 'preact';

// export function lazy(load) {
//   let component, promise;
//   return function Lazy(props) {
//     if (!promise) promise = load().then(m => component = m.default || m);
//     if (!this.waiting) this.waiting = promise.then(c => this.setState({c}));
//     if (!component) throw promise;
//     return h(component, props);
//   }
// }

// export function Suspense(props) { return props.children; }
// Suspense.prototype.componentDidCatch = function(e) {
//   if (e && e.then) {
//     this.__d = true;
//   }
// }

export { Suspense, lazy } from 'preact/compat';
