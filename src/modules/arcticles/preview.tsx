import { createElement } from 'preact';
import ArticleMeta from './meta';
import { useApi } from '../../lib/use-api';

export default function ArticlePreview({ slug = null, article: data }) {
	const article = useApi(api => data || api.getArticle(slug), [slug, data]);

	const articleUrl = `/article/${encodeURIComponent(article.slug)}`;

	if (!article) {
		return <div class="article-preview">loading...</div>;
	}

	return (
		<div class="article-preview">
			<ArticleMeta article={article} />
			<a href={articleUrl} class="preview-link">
				<h1>{article.title}</h1>
				<p>{article.description}</p>
				<span>Read more...</span>
				{article.tagList && article.tagList.length > 0 && (
					<ul class="tag-list">
						{article.tagList.map(tag => (
							<li class="tag-default tag-pill tag-outline">{tag}</li>
						))}
					</ul>
				)}
			</a>
		</div>
	);
}