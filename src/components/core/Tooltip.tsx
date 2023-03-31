import React, { PropsWithChildren, useState } from 'react';

interface TooltipProps extends PropsWithChildren {
	content: string;
	dir: 'left' | 'right' | 'top' | 'bottom';
	delay?: number;
}

const DIR = {
	left: 'right-[calc(100%_+_10px)] top-1/2 -translate-y-1/2 before:border-l-black before:-right-2 before:top-1/2 before:-translate-y-1/2',
	right:
		'left-[calc(100%_+_10px)] top-1/2 -translate-y-1/2 before:border-r-black before:-left-2 before:top-1/2 before:-translate-y-1/2',
	top: 'bottom-[calc(100%_+_10px)] left-1/2 -translate-x-1/2 before:border-t-black before:-bottom-2 before:left-1/2 before:-translate-x-1/2',
	bottom:
		'top-[calc(100%_+_10px)] left-1/2 -translate-x-1/2 before:border-b-black before:-top-2 before:left-1/2 before:-translate-x-1/2',
};

export const Tooltip = ({
	children,
	dir,
	content,
	delay = 300,
}: TooltipProps) => {
	let timeout: number;
	const [active, setActive] = useState(false);

	const showTip = () => {
		timeout = setTimeout(() => {
			setActive(true);
		}, delay);
	};

	const hideTip = () => {
		clearInterval(timeout);
		setActive(false);
	};
	return (
		<div onMouseEnter={showTip} onMouseLeave={hideTip} className="relative">
			{children}
			{active && <div
				className={
					DIR[dir] +
					'  before:border-transparent before:border-4 before:absolute text-sm bg-black py-0.5 px-2 rounded-md text-slate-100 absolute z-30'
				}
			>
				{content}
			</div>}
		</div>
	);
};
