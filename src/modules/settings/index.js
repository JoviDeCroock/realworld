import { useState, useEffect, useCallback } from 'preact/hooks';
import { createElement } from 'preact';
import { useApiClient } from '../../lib/use-api';

export default function SettingsPage({}) {
	const api = useApiClient();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [profile, updateProfile] = useState({});

	useEffect(() => {
		api.getMyProfile().then(profile => {
			updateProfile(profile);
			setLoading(false);
		});
	}, [api]);

	const updateField = useCallback(e => {
		const { name, value } = e.target;
		updateProfile(state => ({ ...state, [name]: value }));
	}, []);

	const submit = useCallback(() => {
		if (loading) return;
		setLoading(true);
		api
			.updateMyProfile(profile)
			.then(profile => {
				updateProfile(profile);
				setLoading(false);
			})
			.catch(err => {
				setError(err);
			});
	}, [api, loading, profile]);

	return (
		<div class="settings-page">
			<div class="container page">
				<div class="row">
					<div class="col-md-6 offset-md-3 col-xs-12">
						<h1 class="text-xs-center">Your Settings</h1>

						{error && (
							<ul key="errors" class="error-messages">
								<li>{error}</li>
							</ul>
						)}

						<form onSubmit={submit} action="javascript:">
							<fieldset>
								<Field
									data={profile}
									name="url"
									onInput={updateField}
									type="url"
									placeholder="URL of profile picture"
									disabled={loading}
								/>
								<Field
									data={profile}
									name="username"
									onInput={updateField}
									placeholder="Your Name"
									large
									disabled={loading}
								/>
								<Field
									is="textarea"
									data={profile}
									name="bio"
									onInput={updateField}
									placeholder="Short bio about you"
									large
									disabled={loading}
								/>
								<Field
									data={profile}
									name="email"
									type="email"
									onInput={updateField}
									placeholder="Email"
									large
									disabled={loading}
								/>
								<Field
									data={profile}
									name="password"
									type="password"
									onInput={updateField}
									placeholder="Password"
									large
									disabled={loading}
								/>
								<button
									type="submit"
									class="btn btn-lg btn-primary pull-xs-right"
									disabled={loading}
								>
									Update Settings
								</button>
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

function Field({ is = 'input', large, data, ...props }) {
	const Type = is;
	return (
		<fieldset class="form-group">
			<Type
				class={`form-control${large ? ' form-control-lg' : ''}`}
				value={data[props.name]}
				{...props}
			/>
		</fieldset>
	);
}