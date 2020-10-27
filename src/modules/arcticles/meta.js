import tinytime from 'tinytime';
import { createElement } from 'preact';
import smiley from '../../assets/smiley-cyrus.jpg';

const date = tinytime('{MMMM} {Do}, {YYYY}');

export default function ArticleMeta({ article }) {
  const authorUrl = `/profile/${encodeURIComponent(article.author.username)}`;

  return (
    <div class="article-meta">
      <a href={authorUrl}>
        <img src={smiley} />
      </a>
      <div class="info">
        <a href={authorUrl} class="author">
          {article.author.username}
        </a>
        <span class="date">{date.render(new Date(article.createdAt))}</span>
      </div>
      <button class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart" /> {article.favoritesCount}
      </button>
    </div>
  );
}
