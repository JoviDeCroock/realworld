import { createElement } from 'preact';
import { useApi } from '../../lib/use-api';
import ArticlePreview from './preview';

/** @param {{ author?, tag?, favorited?, limit? }} props */
export default function ArticlesList({ author, tag, favorited, limit }) {
	console.log('fetching articles');
	const articles = useApi(
		api => api.listArticles({ author, tag, favorited, limit }),
		[author, tag, favorited, limit]
	);
	console.log('fetched articles');

	return articles.map(article => <ArticlePreview article={article} />);
}
