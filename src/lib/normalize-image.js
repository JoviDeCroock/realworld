export function normalizeImage(url) {
	// https://i.stack.imgur.com/xHWG8s.jpg
	const imgur =
		url &&
		url.match(
			/^https?(:\/\/(?:[a-z0-9-]+\.)+imgur\.com\/[^/.]+?)s?(\.[a-z]+)$/
		);
	if (imgur) return `https${imgur[1]}s${imgur[2]}`;

	const local = url && url.match(/\/smiley-cyrus\.jpg$/);
	if (local) return local[0];

	return url;
}
