import { FunctionalModalCardProps } from 'interfaces';
import { EN_US } from 'languages';
import { HTMLAttributes, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { Portal } from 'react-portal';

import { Button } from './Button';
import { Card } from './Card';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
	isOpen?: boolean;
}

const modalVariant: Variants = {
	hidden: {
		opacity: 0,
		transitionEnd: {
			display: 'none',
		},
		transition: {
			duration: 0.2,
			staggerChildren: 10,
			when: 'afterChildren',
		},
	},
	visible: {
		display: 'flex',
		opacity: 1,
	},
};

export const Modal = ({
	onClick,
	children,
	className,
	isOpen = false,
}: ModalProps) => {
	return (
		<Portal node={document.getElementById('modal')}>
			<motion.div
				variants={modalVariant}
				initial="hidden"
				animate={isOpen ? 'visible' : 'hidden'}
				onClick={onClick}
				className={
					'absolute top-0 left-0 z-30 w-screen h-screen bg-black bg-opacity-50 ' +
					(className ?? '')
				}
			>
				{children}
			</motion.div>
		</Portal>
	);
};

interface ConfirmModalProps extends FunctionalModalCardProps {
	id: string;
	header: ReactNode | string;
	message: string;
	onCancel: any;
	confirmButton?: string;
	cancelButton?: string;
}
export const ConfirmModal = ({
	id,
	closeModal,
	currentId,
	onClick,
	onCancel,
	header,
	message,
	confirmButton = EN_US.yes,
	cancelButton = EN_US.no,
}: ConfirmModalProps) => {
	return (
		<Modal
			className="flex justify-center items-center"
			isOpen={currentId === id}
			onClick={() => closeModal(id)}
		>
			<Card className="max-w-fit m-2" onClick={(e) => e.stopPropagation()}>
				{header}
				<p className="py-3 mx-3 font-medium text-gray-600 border-b border-b-gray-100">
					{message}
				</p>
				<section className="flex justify-end gap-3 p-3 items-center">
					<Button
						onClick={() => {
							closeModal(id);
							onCancel();
						}}
						className="max-w-fit enabled:bg-rose-400 py-2"
					>
						{cancelButton}
					</Button>
					<Button
						onClick={onClick}
						className="max-w-fit py-2 enabled:bg-sky-400"
					>
						{confirmButton}
					</Button>
				</section>
			</Card>
		</Modal>
	);
};
