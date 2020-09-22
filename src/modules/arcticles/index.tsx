import { createElement } from 'preact';
import { useApi } from '../../lib/use-api';
import ArticlePreview from './preview';

/** @param {{ author?, tag?, favorited?, limit? }} props */
export default function ArticlesList({ author, tag, favorited, limit }) {
	const articles = useApi(
		api => api.listArticles({ author, tag, favorited, limit }),
		[author, tag, favorited, limit]
	);

	return articles.map(article => <ArticlePreview article={article} />);
}
