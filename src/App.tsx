import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import Login from 'views/auth/login';
import Register from 'views/auth/register';
import { setApiHeader } from 'api';

import Chat from 'views/app/chat';
import { AuthLayout } from 'components/layouts';
import { useAuthStore } from 'store';
import { useEffect } from 'react';
import Loading from 'views/app/loading';
import { EN_US } from 'languages';

const App = () => {
	const token = useAuthStore((state) => state.token);
	setApiHeader('Authorization', `Bearer ${token}`);
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						token ? (
							<Navigate to="/chat" state={{ from: '/root' }} />
						) : (
							<Navigate to="/login" state={{ from: '/root' }} />
						)
					}
				/>
				<Route path="/chat" element={<Chat />} />
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
