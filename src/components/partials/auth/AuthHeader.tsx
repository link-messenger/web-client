import { EN_US } from 'languages';
import React from 'react'

export const AuthHeader = ({title, content}: {title: string, content: string}) => {
  return (
		<header className="space-y-3">
			<h1 className="text-4xl text-slate-800 font-medium">
				{title}
			</h1>
			<p className="text-slate-400 text-base">
				{content}
			</p>
		</header>
	);
}

