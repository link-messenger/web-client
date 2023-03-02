import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'styles/index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
const qc = new QueryClient();
ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
).render(
  <QueryClientProvider client={qc}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </QueryClientProvider>,
);
