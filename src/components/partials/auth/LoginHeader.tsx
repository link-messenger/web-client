import { EN_US } from 'languages';
import React from 'react'

export const LoginHeader = () => {
  return (
		<header className="space-y-3">
			<h1 className="text-4xl text-slate-800 font-medium">
				{EN_US['login.Welcome']}
			</h1>
			<p className="text-slate-400 text-base">
				{EN_US['login.WelcomeSubtitle']}
			</p>
		</header>
	);
}
