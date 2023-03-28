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
import AppLayout from 'components/layouts/AppLayout';
import Verify from 'views/auth/verify';
import ForgetPassword from 'views/auth/forgetPassword';
import ResetPassword from 'views/auth/resetPassword';
import { useEffect } from 'react';

const App = () => {
	const token = useAuthStore((state) => state.token);
	setApiHeader('Authorization', `Bearer ${token}`);
	useEffect(() => {
		document.documentElement.classList.add('dark')
	}, []);
	return (
		<Router>
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route
						path="/"
						element={token ? <Navigate to="/chat" /> : <Navigate to="/login" />}
					/>
					<Route path="/chat" element={<Chat />} />
					<Route element={<AuthLayout />}>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/verify" element={<Verify />} />
						<Route path="/forgetpass" element={<ForgetPassword />} />
						<Route path="/resetpass" element={<ResetPassword />} />
					</Route>
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
