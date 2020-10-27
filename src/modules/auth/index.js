import { useState, useReducer, useCallback } from 'preact/hooks';
import { createElement } from 'preact';
import { route } from 'preact-router';
import { useApiClient } from '../../lib/use-api';

const UPDATE_FROM_INPUT = (state, e) => e.target.value;

export default function AuthPage({ isRegister }) {
  const [name, setName] = useReducer(UPDATE_FROM_INPUT, '');
  const [email, setEmail] = useReducer(UPDATE_FROM_INPUT, '');
  const [password, setPassword] = useReducer(UPDATE_FROM_INPUT, '');
  const [errors, setErrors] = useState(null);
  const api = useApiClient();

  const submit = useCallback(() => {
    const method = isRegister ? api.register : api.login;
    method({ email, password, username: name })
      .then(() => {
        route('/');
      })
      .catch(err => {
        let errors = [err.message];
        if (err.data && err.data.errors) {
          errors = Object.keys(err.data.errors).map(
            key => `${key} ${err.data.errors[key]}`
          );
        }
        setErrors(errors);
      });
  }, [api, email, password]);

  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">{isRegister ? 'Sign up' : 'Log In'}</h1>
            <p class="text-xs-center">
              {isRegister ? (
                <a href="/login">Have an account?</a>
              ) : (
                <a href="/register">Need an account?</a>
              )}
            </p>

            {errors && (
              <ul key="errors" class="error-messages">
                {errors.map(error => (
                  <li>{error}</li>
                ))}
              </ul>
            )}

            <form action="javascript:" onSubmit={submit}>
              {isRegister && (
                <fieldset key="name" class="form-group">
                  <input
                    class="form-control form-control-lg"
                    placeholder="Your Name"
                    value={name}
                    onInput={setName}
                  />
                </fieldset>
              )}
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  placeholder="Email"
                  value={email}
                  onInput={setEmail}
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onInput={setPassword}
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                {isRegister ? 'Sign up' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
