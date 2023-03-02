import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import Login from 'views/auth/login';
import Register from 'views/auth/register';
import { pb } from 'api';
import { useGetUserProfile } from 'hooks';

import Chat from 'views/app/chat';
import { AuthLayout } from 'components/layouts';

const App = () => {
	const { data: userData } = useGetUserProfile({});
	const isValid = userData;
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={isValid ? <Navigate to="/chat" /> : <Navigate to="/login" />}
				/>
				<Route path="/dashboard" element={<Chat />} />
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
