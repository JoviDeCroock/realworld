import { createContext } from 'preact';
import { useMemo, useContext, useEffect, useState } from 'preact/hooks';
import apiClient from './api';

/** @typedef {ReturnType<apiClient>} Api */

/** @typedef {{ username: string, token: string, email: string, bio: string? }} User */

/** @type {preact.Context<Api>} */
const ApiContext = createContext(null);

/** @type {preact.Context<User>} */
const AuthContext = createContext(null);

export function ApiProvider({ children, ...config }) {
	const api = useMemo(() => apiClient(config), [config]);
	const [user, setUser] = useState(api.getCurrentUser());

	useEffect(() => {
		api.on('user', setUser);
		return () => api.off('user', setUser);
	}, [api]);

	return (
		<ApiContext.Provider value={api}>
			<AuthContext.Provider value={user}>{children}</AuthContext.Provider>
		</ApiContext.Provider>
	);
}

/**
 * @param {(api: Api)=>any} initializer
 * @param {Array<any>} deps
 */
export function useApi(method, deps) {
  const api = useApiClient();
	const result = useMemo(() => method(api), deps);
  return result.read ? result.read() : result;
}

export function useApiClient() {
	return useContext(ApiContext);
}

export function useCurrentUser() {
	return useContext(AuthContext);
}
