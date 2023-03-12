import { HTMLAttributes, MouseEventHandler, PropsWithChildren } from 'react';
import { Portal } from 'react-portal';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
	isOpen?: boolean;
}

export const Modal = ({ onClick,children, className, isOpen = false }: ModalProps) => {
	return (
		<Portal node={document.getElementById('modal')}>
			<div
				onClick={onClick}
				className={
					'absolute top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-50 ' +
					(className ?? '') +
					(isOpen ? ' flex' : ' w-0 hidden')
				}
			>
				{children}
			</div>
		</Portal>
	);
};
