import './assets/main.css';
import './assets/fonts.css';
import { lazy, Suspense, createElement } from 'preact/compat';
import { Router } from 'preact-router';

import { Loading } from './common';
import { ApiProvider } from './lib/use-api';
import Footer from './common/Footer';
import Header from './common/Header';

const HomePage = lazy(() => import('./modules/arcticles'));
const ArticlePage = lazy(() => import('./modules/arcticles/detail'));
const AuthPage = lazy(() => import('./modules/auth'));
const SettingsPage = lazy(() => import('./modules/settings'));
const ProfilePage = lazy(() => import('./modules/auth/Profile'));
const NewArticlePage = lazy(() => import('./modules/arcticles/create'));

export default function App({ cache }) {
	return (
    <ApiProvider cache={cache}>
      <div id="app">
        <Header />
        <div id="main">
          <Suspense fallback={<Loading />}>
            <Router>
              <HomePage path="/" />
              <ArticlePage path="/article/:slug" />
              <ProfilePage path="/profile" username="" />
              <ProfilePage path="/profile/:username" />
              <AuthPage path="/login" />
              <AuthPage path="/register" isRegister />
              <NewArticlePage path="/new" />
              <SettingsPage path="/settings" />
              <NotFound default />
            </Router>
          </Suspense>
        </div>
        <Footer />
      </div>
    </ApiProvider>
	);
}

function NotFound() {
	return (
		<div>
			<h2>Not Found</h2>
		</div>
	);
}
