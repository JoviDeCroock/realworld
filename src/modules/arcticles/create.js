import { useCallback, useReducer } from 'preact/hooks';
import { createElement } from 'preact';
import { useApiClient } from '../../lib/use-api';

export default function NewPage({}) {
	const api = useApiClient();
	const [fields, action] = useReducer(
		(state, action) => {
			switch (action.type) {
				case 'update': {
					const { name, value } = action.event.target;
					return {
						...state,
						[name]: value
					};
				}
				case 'addTag': {
					if (!state.tag) break;
					return {
						...state,
						tag: '',
						tagList: state.tagList.concat(state.tag)
					};
				}
			}
			return state;
		},
		{ tagList: [] }
	);
	const updateField = useCallback(event => {
		action({ type: 'update', event });
	}, []);
	const tagKeyDown = useCallback(e => {
		if (e.keyCode === 13) {
			action({ type: 'addTag' });
			e.preventDefault();
		}
	}, []);
	const create = useCallback(() => {
		api.createArticle({
			article: fields
		});
	}, [api, fields]);
	return (
		<div class="editor-page">
			<div class="container page">
				<div class="row">
					<div class="col-md-10 offset-md-1 col-xs-12">
						<form onSubmit={create} action="javascript:">
							<fieldset>
								<fieldset class="form-group">
									<input
										name="title"
										value={fields.title}
										onInput={updateField}
										class="form-control form-control-lg"
										placeholder="Article Title"
									/>
								</fieldset>
								<fieldset class="form-group">
									<input
										name="description"
										value={fields.description}
										onInput={updateField}
										class="form-control"
										placeholder="What's this article about?"
									/>
								</fieldset>
								<fieldset class="form-group">
									<textarea
										name="body"
										value={fields.body}
										onInput={updateField}
										class="form-control"
										rows="8"
										placeholder="Write your article (in markdown)"
									/>
								</fieldset>
								<fieldset class="form-group">
									<input
										name="tag"
										value={fields.tag}
										onInput={updateField}
										onKeyDown={tagKeyDown}
										class="form-control"
										placeholder="Enter tags"
									/>
									<div class="tag-list">
										{fields.tagList.map(tag => (
											<span class="tag-pill tag-default">{tag}</span>
										))}
									</div>
								</fieldset>
								<button
									class="btn btn-lg pull-xs-right btn-primary"
									type="button"
								>
									Publish Article
								</button>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}