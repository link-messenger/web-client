import { Button, Card, NormalInput, Toggle } from 'components/core';
import { Modal } from 'components/core/Modal';
import {
	CREATE_GROUP_INITIALS,
	CREATE_GROUP_MODAL,
	CREATE_GROUP_VALIDATION,
	USER_PROFILE_MODAL,
} from 'constants';
import { Field, Form, Formik } from 'formik';
import { useModal } from 'hooks';
import { IProfile } from 'interfaces';
import { EN_US } from 'languages';
import { PropsWithChildren } from 'react';
import { useMenuStore } from 'store';
import { ListAvatar } from './Avatar';
import { CreateGroupModal } from './Group';
import { EditUserProfileModal } from './Profile';

export const SideMenu = ({ user }: { user: IProfile }) => {

	const open = useMenuStore((state) => state.open);
	const toggle = useMenuStore((state) => state.toggle);
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

	return (
		<Modal onClick={toggle} isOpen={open}>
			<nav
				onClick={(e) => e.stopPropagation()}
				className="w-4/5 md:w-96 h-full bg-white border-r border-r-gray-400 min-w-xs shadow-xl"
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

				<ul className="flex flex-col gap-3 p-4">
					{MAIN_MENU.map((item, index) => (
						<li
							onClick={item.onClick}
							key={index}
							className="p-4 flex items-center gap-2 cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100"
						>
							<i className={item.icon + ' text-xl'} />
							<p className="capitalize text-gray-800">{item.name}</p>
						</li>
					))}
				</ul>

				<CreateGroupModal closeModal={closeModal} currentId={currentId} />
				<EditUserProfileModal closeModal={closeModal} currentId={currentId} />
			</nav>
		</Modal>
	);
};
