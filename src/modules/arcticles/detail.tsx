import { Suspense } from 'preact/compat';
import ArticleMeta from './meta';
import ArticleComments from './comments';
import { useApi } from '../../lib/use-api';
import { Loading } from '../../common';

export default function ArticlePage({ slug }) {
	const article = useApi(api => api.getArticle(slug), [slug]);

	if (!article) {
		return <div class="article-page">{loading && 'Loading...'}</div>;
	}

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
					{/* This error boundary means comment loading doesn't hold back route transitions or hydration. */}
					<Suspense loading={<Loading />}>
						<ArticleComments article={article} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}