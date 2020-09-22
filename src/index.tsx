import { createElement, render } from 'preact';
import { setPragma } from 'goober';
import normalize from './global/normalizeStyles';
import App from './App';

import './assets/ionicons.woff'
import './assets/fonts.css'
import './assets/main.css'
import './assets/ionicons.min.css'

setPragma(createElement);
normalize();

render(<App />, document.getElementById('root'));
