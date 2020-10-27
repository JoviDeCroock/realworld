import { createElement } from 'preact';
import { Suspense } from '../../lib/progressive-hydration'
import ArticleMeta from './meta';
import ArticleComments from '../comments/comments';
import { useApi } from '../../lib/use-api';
import { Loading } from '../../common';

// TODO: add the Suspense.fallbacks again when hydration does not trigger
// Suspense.fallback boundaries.
export default function ArticlePage({ slug }) {
	const article = useApi(api => api.getArticle(slug), [slug]);

	return (
		<div class="article-page">
			<div class="banner">
				<div class="container">
					<h1>{article.title}</h1>

					<ArticleMeta article={article}>
						<button class="btn btn-sm btn-outline-secondary">
							<i class="ion-plus-round" />
							Follow {article.author.username} <span class="counter">(??)</span>
						</button>
						&nbsp;&nbsp;
						<button class="btn btn-sm btn-outline-primary">
							<i class="ion-heart" />
							Favorite Post{' '}
							<span class="counter">({article.favoritesCount})</span>
						</button>
					</ArticleMeta>
				</div>
			</div>

			<div class="container page">
				<div class="row article-content">
					<div class="col-md-12">
						<p>{article.description}</p>
						<h2 id="introducing-ionic">{article.title}</h2>
						<p>{article.body}</p>
					</div>
				</div>

				<hr />

				<div class="article-actions">
					<ArticleMeta article={article}>
						<button class="btn btn-sm btn-outline-secondary">
							<i class="ion-plus-round" />
							Follow {article.author.username} <span class="counter">(??)</span>
						</button>
						&nbsp;&nbsp;
						<button class="btn btn-sm btn-outline-primary">
							<i class="ion-heart" />
							Favorite Post{' '}
							<span class="counter">({article.favoritesCount})</span>
						</button>
					</ArticleMeta>
				</div>

				<div class="row">
					<Suspense fallback={<Loading />}>
						<ArticleComments article={article} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}