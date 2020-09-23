/**
 * See documentation:
 * https://github.com/gothinkster/realworld/tree/master/api
 */
import cookies from 'js-cookie';
import mitt from 'mitt';

const API_ROOT = 'https://conduit.productionready.io/api';
const PER_PAGE = 20;

const IS_BROWSER = typeof document !== 'undefined';

function wrapPromise(maybePromise) {
	let status = "pending";
	let result;
	let suspender;
	if (maybePromise.then) {
		suspender = maybePromise.then(
			(r) => {
				status = "success";
				result = r;
			},
			(e) => {
				status = "error";
				result = e;
			}
		);
	} else {
		status = 'success';
		result = maybePromise;
	}

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

export default function apiClient(options = {}) {
	const { emit, on, off } = mitt();

	const client = {};
	client.on = on;
	client.off = off;
	client.options = options;

	let token = options.token;
	let currentUser = options.user;

	function init() {
		if (IS_BROWSER) {
			token = cookies.get('token');
			try {
				currentUser = JSON.parse(localStorage.getItem('user'));
			} catch (e) {}
		}

		if (currentUser && !token) {
			token = currentUser.token;
			if (IS_BROWSER) {
				cookies.set('token', token);
			}
		}

		if (token && !currentUser) {
			currentUser = {
				token
			};
		}
	}

	function method(method, url, config, promise) {
		return (...args) =>
      promise ? wrapPromise(apiCall(
				method,
				url.replace(/:[a-z]+/g, (s, f) => enc(args.shift())),
				args.pop(),
				config,
				client
			)) : apiCall(
				method,
				url.replace(/:[a-z]+/g, (s, f) => enc(args.shift())),
				args.pop(),
				config,
				client
			);
	}

	function handleLogin(req, data) {
		if (!data.token) return;
		client.setCurrentUser(data);
		client.setToken(data.token);
	}

	client.getCurrentUser = () => currentUser;
	client.setCurrentUser = user => {
		currentUser = user;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('user', JSON.stringify(user));
		}
		emit('authchange', { user });
		emit('user', user);
	};

	client.getToken = () => token;
	client.setToken = t => {
		token = t;
		cookies.set('token', token);
	};

	client.login = method('POST', '/users/login', {
		bodyKey: 'user',
		after: handleLogin
	}, false);
	client.register = method('POST', '/users', {
		bodyKey: 'user',
		after: handleLogin
	}, false);

	client.getMyProfile = method('GET', '/user', undefined, true);
	client.updateMyProfile = method('PUT', '/user', { bodyKey: 'user' }, false);

	client.getProfile = method('GET', `/profiles/:username`, undefined, true);
	client.followProfile = method('POST', `/profiles/:username/follow`, undefined, false);
	client.unfollowProfile = method('DELETE', `/profiles/:username/follow`, undefined, false);

	client.listTags = method('GET', '/tags', undefined, true);

	client.listArticles = method('GET', '/articles', undefined, true);
	client.getArticle = method('GET', '/articles/:slug', undefined, true);
	client.createArticle = method('POST', '/articles', undefined, false);
	client.updateArticle = method('PUT', '/articles/:slug', undefined, false);
	client.deleteArticle = method('DELETE', '/articles/:slug', undefined, false);

	client.favoriteArticle = method('POST', '/articles/:slug/favorite', undefined, false);
	client.unfavoriteArticle = method('DELETE', '/articles/:slug/favorite', undefined, false);

	client.listComments = method('GET', '/articles/:slug/comments', undefined, true);
	client.createComment = method('POST', '/articles/:slug/comments', undefined, false);
	client.deleteComment = method('POST', '/articles/:slug/comments/:id', undefined, false);

	if (options.cache) {
		cache = options.cache;
	} else {
		cache = {};
	}

	init();
	return client;
}

let cache;

function apiCall(method, url, body, config, client) {
	config = config || {};
	method = (method || 'GET').toUpperCase();
	const opts = { method, headers: {}, body: null };
	if (body) {
		if (method === 'GET' || method === 'DELETE') {
			const { page, ...params } = body;
			if (page) {
				params.offset = page * PER_PAGE;
				params.limit = PER_PAGE;
			}
			url += qs(params);
		} else {
			if (config.bodyKey) body = { [config.bodyKey]: body };
			opts.body = JSON.stringify(body);
			opts.headers['Content-Type'] = 'application/json';
		}
	}
	opts.url = API_ROOT + url;

	if (config.auth !== false && client.getToken()) {
		opts.headers.Authorization = `Token ${client.getToken()}`;
	}

	if (config.before) {
		config.before(opts);
	}

	const cacheKey = body ? method + url + qs(body) : method + url;
	if (cache[cacheKey]) return cache[cacheKey];

	let response;
	return fetch(opts.url, opts)
		.then(r => {
			response = r;
			return r.json();
		})
		.then(data => {
			if (!data.errors) {
				for (let i in data) {
					if (!/count/i.test(i)) {
						data = data[i];
						break;
					}
				}
			}

			opts.response = response;
			opts.data = data;
			if (config.after) {
				config.after(opts, data);
			}
			if (response.status >= 400 || response.status < 200) {
				const err = Error(response.statusText);
				err.data = data;
				err.response = response;
				throw err;
			}
			return cache[cacheKey] = data;
		});
}

function qs(obj, start = '?', delimiter = '&') {
	let out = '';
	let sep = start;
	for (let i in obj) {
		const value = obj[i];
		if (value != null) {
			out += `${sep}${enc(i)}=${enc(value)}`;
			sep = delimiter;
		}
	}
	return out;
}
const enc = encodeURIComponent;