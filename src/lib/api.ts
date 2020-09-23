/**
 * See documentation:
 * https://github.com/gothinkster/realworld/tree/master/api
 */
import cookies from 'js-cookie';
import mitt from 'mitt';

const API_ROOT = 'https://conduit.productionready.io/api';
const PER_PAGE = 20;

const IS_BROWSER = typeof document !== 'undefined';

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
			status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
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

	function method(method, url, config) {
		return (...args) =>
      wrapPromise(apiCall(
				method,
				url.replace(/:[a-z]+/g, (s, f) => enc(args.shift())),
				args.pop(),
				config,
				client
			));
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
	});
	client.register = method('POST', '/users', {
		bodyKey: 'user',
		after: handleLogin
	});

	client.getMyProfile = method('GET', '/user');
	client.updateMyProfile = method('PUT', '/user', { bodyKey: 'user' });

	client.getProfile = method('GET', `/profiles/:username`);
	client.followProfile = method('POST', `/profiles/:username/follow`);
	client.unfollowProfile = method('DELETE', `/profiles/:username/follow`);

	client.listTags = method('GET', '/tags');

	client.listArticles = method('GET', '/articles');
	client.getArticle = method('GET', '/articles/:slug');
	client.createArticle = method('POST', '/articles');
	client.updateArticle = method('PUT', '/articles/:slug');
	client.deleteArticle = method('DELETE', '/articles/:slug');

	client.favoriteArticle = method('POST', '/articles/:slug/favorite');
	client.unfavoriteArticle = method('DELETE', '/articles/:slug/favorite');

	client.listComments = method('GET', '/articles/:slug/comments');
	client.createComment = method('POST', '/articles/:slug/comments');
	client.deleteComment = method('POST', '/articles/:slug/comments/:id');

	init();
	return client;
}

// const CACHE = new Map();

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
			// if (!opts.body) {
			// 	const cacheControl = response.headers.get('cache-control') || '';
			// 	const maxAge = (cacheControl.match(/max-age *= *(\d+)/g) || [])[1] | 0;
			// 	CACHE.set(cacheKey, {
			// 		time: Date.now(),
			// 		maxAge: Math.max(10000, maxAge),
			// 		data
			// 	});
			// }
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
			return data;
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