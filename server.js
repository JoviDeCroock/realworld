const polka = require('polka');
const path = require('path');
const fs = require('fs');
const sirv = require('sirv');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const prerender = require('./dist/server').default;

const PRODUCTION = process.env.NODE_ENV === 'production';
const dist = path.resolve(__dirname, 'dist');

const distFiles = fs.readdirSync(dist);
const jsEntry = distFiles.find(file => file.startsWith('main') && file.endsWith('.js'));
const cssEntry = distFiles.find(file => file.startsWith('main') && file.endsWith('.css'));
const fontEntry = distFiles.find(file => file.endsWith('.woff'));

const server = polka();

server.use(compression());

// serve static files from public/*
server.use((req, res, next) => {
	res._requestHeaders = req.headers;
	next();
});

server.use(
	sirv('dist', {
		dev: !PRODUCTION,
		extensions: [],
		maxAge: 3600,
		etag: true,
		setHeaders(res, path, stats) {
			const etag = res._requestHeaders['if-none-match'];
			const computedEtag = `W/"${stats.size}-${stats.mtime.getTime()}"`;
			if (etag && etag === computedEtag) {
				res.writeHead(304);
				res.end();
				// disable sirv's normal response & piping:
				res.writeHead = res.write = res.end = () => {};
			}
		}
	})
);

server.use('/', cookieParser(), (req, res, next) => {
  res.setHeader('Cache-Control', 'max-age=3600');
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  prerender(req, jsEntry, cssEntry, fontEntry)
    .then(html => {
      res.response = null;
      res.end(html);
    })
    .catch(error => {
			console.log('error', error);
			if (error.then) error.then(console.log)
      next(error.stack);
    });
});

server.listen(process.env.PORT || 5000);
