import React from 'react';
import { motion, Variants } from 'framer-motion';
const icon: Variants = {
	hidden: {
		pathLength: 0,
		fill: '#7269ef00',
	},
	visible: {
		pathLength: 1,
		fill: '#7269ef89',
		transition: {
			repeat: Infinity,
			repeatType: 'mirror',
			duration: 4,
			repeatDelay: 1,
		},
	},
};

const Loading = () => {
	return (
		<motion.main
			whileInView={{ opacity: 1 }}
			animate={{ opacity: 0 }}
			className="bg-white dark:bg-dark-gray fixed top-0 left-0 h-screen w-screen grid place-items-center"
		>
			<div className="w-10 aspect-square">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 300 300"
					id="bolt-alt"
					className="scale-[5]"
				>
					<motion.path
						variants={icon}
						initial="hidden"
						animate="visible"
						stroke-linecap="round"
						stroke-linejoin="round"
						className="overflow-visible stroke-primary stroke-2"
						transition={{
							default: { duration: 2, ease: 'easeInOut' },
							fill: { duration: 2, ease: [1, 0, 0.8, 1] },
						}}
						d="M221.67244 118.88505L130 244.88918v-86.00413h-61.67244L160 32.88092v86.00413h61.67244Z"
					></motion.path>
				</svg>
			</div>
		</motion.main>
	);
};

export default Loading;
