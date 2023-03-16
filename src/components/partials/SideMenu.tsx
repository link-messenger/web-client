import { Button, Card, NormalInput, Toggle } from 'components/core';
import { Modal } from 'components/core/Modal';
import {
	CREATE_GROUP_INITIALS,
	CREATE_GROUP_MODAL,
	CREATE_GROUP_VALIDATION,
	USER_PROFILE_MODAL,
} from 'constants';
import { Field, Form, Formik } from 'formik';
import { useLogout, useModal } from 'hooks';
import { IProfile } from 'interfaces';
import { EN_US } from 'languages';
import { MouseEventHandler, PropsWithChildren } from 'react';
import { useChatStore, useMenuStore } from 'store';
import { ListAvatar } from './Avatar';
import { CreateGroupModal } from './Group';
import { EditUserProfileModal } from './Profile';

export const SideMenu = ({ user }: { user: IProfile }) => {
	const open = useMenuStore((state) => state.open);
	const toggle = useMenuStore((state) => state.toggle);
	const close = useMenuStore((state) => state.close);
	const { currentId, openModal, closeModal } = useModal();
	const MAIN_MENU = [
		{
			name: 'new group',
			onClick: () => {
				toggle();
				openModal(CREATE_GROUP_MODAL);
			},
			icon: 'uil uil-users-alt',
		},
		{
			name: 'about us',
			onClick: () => {},
			icon: 'uil uil-info-circle',
		},
	];

	const { mutateAsync: logout } = useLogout();
	const onLogout = () => {
		logout().then(() => {
			close();
		});
	};

	return (
		<Modal onClick={toggle} isOpen={open}>
			<nav
				onClick={(e) => e.stopPropagation()}
				className="w-4/5 md:w-96 h-full flex flex-col bg-white border-r border-r-gray-400 min-w-xs shadow-xl"
			>
				<header className="text-lg p-3 flex gap-3 items-center border-b border-b-gray-100">
					<ListAvatar size="w-14" username={user?.username} />
					<section className="flex flex-col gap-0 flex-1">
						<h3 className="font-medium">{user?.name}</h3>
						<span className="text-sm text-gray-400 underline">
							#{user?.username}
						</span>
					</section>
					<span
						onClick={() => {
							toggle();
							openModal(USER_PROFILE_MODAL);
						}}
						className="underline text-sm text-gray-400 self-start mt-2.5 cursor-pointer"
					>
						{EN_US['settings.EditProfile']}
					</span>
				</header>

				<section className="flex-grow flex flex-col justify-between">
					<section className="flex flex-col gap-3 p-4">
						{MAIN_MENU.map(({ icon, name, onClick }, index) => (
							<ListItem key={`menu-item-${index}`} icon={icon} name={name} onClick={onClick} />
						))}
					</section>

					<section className="p-4">
						<ListItem
							name="Log Out"
							className="text-rose-400"
							icon="uil uil-sign-out-alt"
							onClick={onLogout}
						/>
					</section>
				</section>
			</nav>
			<CreateGroupModal closeModal={closeModal} currentId={currentId} />
			<EditUserProfileModal closeModal={closeModal} currentId={currentId} />
		</Modal>
	);
};

const ListItem = ({
	name,
	onClick,
	icon,
	className,
}: {
	name: string;
	icon: string;
	className?: string;
	onClick: MouseEventHandler<HTMLDivElement>;
}) => {
	return (
		<div
			onClick={onClick}
			className={
				(className ?? '') +
				' text-gray-800 p-4 flex items-center gap-2 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100'
			}
		>
			<i className={icon + ' text-xl'} />
			<p className="capitalize ">{name}</p>
		</div>
	);
};
