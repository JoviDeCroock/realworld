import { createElement } from 'preact';

export default function CommentForm() {
  return (
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        />
      </div>
      <div class="card-footer">
        <img
          src="https://i.imgur.com/Qr71crqs.jpg"
          class="comment-author-img"
        />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>
  );
}
