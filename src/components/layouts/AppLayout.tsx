import { NavMenu } from 'components/partials';
import React from 'react'
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className='bg-light-light-gray dark:bg-dark-light-gray flex flex-col-reverse h-screen w-screen lg:flex-row'>
      <NavMenu />
      <Outlet />
		</div>
	);
}

export default AppLayout