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
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
	queryCache: new QueryCache({
		onError: async (error, query) => {
			// @ts-ignore
			const response = error?.response as Response;
			const refresh = getRefreshToken();

			if (response.status === 401) {
				console.log('run1');
				if (refresh) {
					const { token, refresh: newRefresh } = await postRefreshToken({
						refresh,
					}).catch((err) => {
						if (err.response.status === 401) {
							clearAuthStorage();
							window.location.replace(
								new URL('/login', window.location.origin)
							);
						}
					});
					if (token && newRefresh) {
						setToken(token, newRefresh);
						window.location.replace(new URL('/chat', window.location.origin));
						return;
					}
				}
				console.log('run');
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
