import React from 'react'
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className='dark:bg-light-gray'>
      <Outlet />
			{/* <ReloadPrompt /> */}
		</div>
	);
}

export default AppLayout