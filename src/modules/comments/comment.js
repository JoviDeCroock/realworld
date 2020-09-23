import { createElement } from 'preact';
import tinytime from 'tinytime';
import smiley from '../../assets/smiley-cyrus.jpg'

const date = tinytime('{MMMM} {Do}, {YYYY}');

export default function Comment({ comment }) {
	const authorUrl = `/profile/${encodeURIComponent(comment.author.username)}`;

	return (
		<div class="card">
			<div class="card-block">
				<p class="card-text">{comment.body}</p>
			</div>
			<div class="card-footer">
				<a href={authorUrl} class="comment-author">
					<img
						src={smiley}
						class="comment-author-img"
					/>
				</a>{' '}
				<a href={authorUrl} class="comment-author">
					{comment.author.username}
				</a>
				<span class="date-posted">
					{date.render(new Date(comment.createdAt))}
				</span>
			</div>
		</div>
	);
}