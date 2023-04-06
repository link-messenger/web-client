import { HTMLAttributes, PropsWithChildren } from 'react';

export const Card = ({
	children,
	className,
	...others
}: HTMLAttributes<HTMLDivElement>) => {
	return (
		<section
			className={
				'bg-white dark:bg-dark-gray min-w-[100px] min-h-[100px] rounded-lg shadow-xl ' +
				(className ?? '')
			}
      {...others}
		>
			{children}
		</section>
	);
};
