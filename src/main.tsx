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
import { clearAuthStorage } from 'store';
const qc = new QueryClient({
	queryCache: new QueryCache({
		onError: async (error, query) => {
			// @ts-ignore
			const response = error?.response as Response;
			if (response.status === 401) {
				clearAuthStorage();
				window.location.replace(new URL('/', window.location.origin));
			}
		},
	}),
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={qc}>
			<App />
			{import.meta.env.DEV && <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />}
		</QueryClientProvider>
	</React.StrictMode>
);
