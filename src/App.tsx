import { lazy, Suspense, createElement } from 'preact/compat';
import { Router } from 'preact-router';

import { Loading } from './common';
import { ApiProvider } from './lib/use-api';

const HomePage = lazy(() => import('./modules/arcticles'));

export default function App() {
	return (
    <ApiProvider>
      <div id="app">
        <div id="main">
          <Suspense loading={<Loading />}>
            <Router>
              <HomePage path="/" />
            </Router>
          </Suspense>
        </div>
      </div>
    </ApiProvider>
	);
}
