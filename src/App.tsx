import { lazy, Suspense, createElement } from 'preact/compat';
import { Router } from 'preact-router';

import { Loading } from './common';
import { ApiProvider } from './lib/use-api';

const HomePage = lazy(() => import('./modules/arcticles'));
const ArticlePage = lazy(() => import('./modules/arcticles/detail'));

export default function App() {
	return (
    <ApiProvider>
      <div id="app">
        <div id="main">
          <Suspense fallback={<Loading />}>
            <Router>
              <HomePage path="/" />
              <ArticlePage path="/article/:slug" />
            </Router>
          </Suspense>
        </div>
      </div>
    </ApiProvider>
	);
}
