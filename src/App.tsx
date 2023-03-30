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
import { useAuthStore, useThemeStore } from 'store';
import AppLayout from 'components/layouts/AppLayout';
import Verify from 'views/auth/verify';
import ForgetPassword from 'views/auth/forgetPassword';
import ResetPassword from 'views/auth/resetPassword';
import { useEffect } from 'react';

const App = () => {
	const token = useAuthStore((state) => state.token);
	setApiHeader('Authorization', `Bearer ${token}`);

	const theme = useThemeStore((state) => state.theme);

	useEffect(() => {
		if (theme === 'dark') {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		}
	}, [theme]);
	return (
		<Router>
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route
						path="/"
						element={token ? <Navigate to="/chat" /> : <Navigate to="/login" />}
					/>
					<Route path="/chat" element={<Chat />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/verify" element={<Verify />} />
					<Route path="/forgetpass" element={<ForgetPassword />} />
					<Route path="/resetpass" element={<ResetPassword />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
