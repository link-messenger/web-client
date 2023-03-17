import React from 'react'
import { Outlet } from 'react-router-dom';
import ReloadPrompt from 'views/app/offline';

const AppLayout = () => {
  return (
    <div>
      <Outlet />
			<ReloadPrompt />
		</div>
	);
}

export default AppLayout