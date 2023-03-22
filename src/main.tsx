import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'styles/index.css';
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { clearAuthStorage, getRefreshToken, setToken } from 'store';
import { postRefreshToken } from 'api';
const qc = new QueryClient({
	queryCache: new QueryCache({
		onError: async (error, query) => {
			// @ts-ignore
			const response = error?.response as Response;
			const refresh = getRefreshToken();

			if (response.status === 401) {
				if (refresh) {
					const { token, refresh: newRefresh } = await postRefreshToken({
						refresh,
					});
					if (token && newRefresh) {
						setToken(token, newRefresh);
						window.location.replace(new URL('/chat', window.location.origin));
						return;
					}
				}
				clearAuthStorage();
				window.location.replace(new URL('/login', window.location.origin));
			}
		},
	}),
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={qc}>
			<App />
			{/* {import.meta.env.DEV && <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />} */}
		</QueryClientProvider>
	</React.StrictMode>
);
