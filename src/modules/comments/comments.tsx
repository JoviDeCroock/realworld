import { createElement } from 'preact';
import { useReducer } from 'preact/hooks';
import { useApi } from '../../lib/use-api';
import CommentForm from './comment-form';
import Comment from './comment';

const ADD_COMMENT = (comments, comment) => comments.concat(comment);

export default function ArticleComments({ slug, article }) {
	const articleSlug = (article && article.slug) || slug;
	const [comments] = useApi(api => api.listComments(articleSlug), [articleSlug]);
	const [localComments, addComment] = useReducer(ADD_COMMENT, []);
	const allComments = [].concat(localComments || [], comments || []);

	return (
		<div class="col-xs-12 col-md-8 offset-md-2">
			<CommentForm article={article} onAdd={addComment} />
			{allComments.map(comment => (
				<Comment comment={comment} />
			))}
		</div>
	);
}