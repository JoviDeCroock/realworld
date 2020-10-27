import { Link } from 'preact-router/match';
import { createElement } from 'preact';
import { useCurrentUser } from '../lib/use-api';

export default function Header() {
  const user = useCurrentUser();
  const isLoggedIn = !!user;

  return (
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="/">
          conduit
        </a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <Link class="nav-link" href="/">
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li class="nav-item">
                <a class="nav-link" href="/new">
                  <i class="ion-compose" /> New Post
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/settings">
                  <i class="ion-gear-a" /> Settings
                </a>
              </li>
            </>
          ) : (
            <>
              <li class="nav-item">
                <a class="nav-link" href="/login">
                  Sign in
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/register">
                  Sign up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
