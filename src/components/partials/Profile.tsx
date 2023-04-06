import { Button, Card, Modal, PaleInput, ConfirmModal } from '../core';
import { DELETE_ACCOUNT_CONF_MODAL, USER_PROFILE_MODAL } from 'constants';
import { Field, Form, Formik } from 'formik';
import { useDeleteAccount, useEditProfile, useGetUserProfile } from 'hooks';
import { IEditUserProfile, ModalCardProps } from 'interfaces';
import { EN_US } from 'languages';
import { formatDate } from 'utils/time';
import { Avatar } from './Avatar';

interface EditUserProfileModalProps extends ModalCardProps {
	openModal: (id: string) => void;
}

export const EditUserProfileModal = ({
	openModal,
	closeModal,
	currentId,
}: EditUserProfileModalProps) => {
	const { data: user, refetch } = useGetUserProfile();
	const { mutateAsync: editProfile } = useEditProfile();
	const { mutate: deleteAccount } = useDeleteAccount();
	if (!user)
		return (
			<Modal
				className="justify-center items-center"
				onClick={() => closeModal(USER_PROFILE_MODAL)}
				isOpen={currentId === USER_PROFILE_MODAL}
			>
				<Card className="text-center grid place-items-center w-80 font-bold text-gray-400 text-2xl">
					{EN_US['common.IsLoading']}
				</Card>
			</Modal>
		);

	const updatedAt = formatDate(user.updatedAt, 'short');

	const onEditProfileSubmit = (data: IEditUserProfile) => {
		editProfile(data).then(() => {
			refetch();
		});
	};

	return (
		<Modal
			className="justify-center items-center"
			onClick={() => closeModal(USER_PROFILE_MODAL)}
			isOpen={currentId === USER_PROFILE_MODAL}
		>
			<Card
				onClick={(e) => e.stopPropagation()}
				className="m-2 w-full md:w-[600px]"
			>
				<Formik
					initialValues={{
						name: user.name,
						username: user.username,
						email: user.email,
					}}
					onSubmit={onEditProfileSubmit}
				>
					{({ dirty }) => (
						<Form>
							<header className="border-b border-b-gray-100 p-3 flex items-center">
								<Avatar size="w-16" username={user.name} />
								<div className="flex flex-grow flex-col ml-3 gap-1">
									<section className="flex items-center">
										<Field
											as={PaleInput}
											placeholder="Enter your name"
											name="name"
											className="text-lg font-semibold text-gray-800"
										/>
										<button
											className="text-rose-500 h-fit text-xs font-medium underline"
											onClick={() => openModal(DELETE_ACCOUNT_CONF_MODAL)}
										>
											{EN_US['delete']}
										</button>
									</section>
									<section className="flex items-center">
										<Field
											as={PaleInput}
											placeholder="Enter a username"
											name="username"
											className="text-sm  underline text-gray-500"
										/>
										<span className="text-xs text-gray-400 whitespace-nowrap">
											{EN_US['profile.LastUpdatedAt']} {updatedAt}
										</span>
									</section>
								</div>
							</header>
							<section className="p-3">
								<h3 className="text-gray-800 font-medium text-lg mb-3">
									{EN_US['settings.ProfileInfo']}
								</h3>
								<section className="flex gap-4 items-center">
									<span>{EN_US['settings.Email']}</span>
									<Field
										as={PaleInput}
										className="w-fit"
										name="email"
										placeholder="Email"
									/>
								</section>
							</section>
							<section className="p-3 pt-0 space-y-2">
								<Button className="py-2" disabled={!dirty} type="submit">
									{EN_US['profile.Edit']}
								</Button>
							</section>
						</Form>
					)}
				</Formik>
				<ConfirmModal
					closeModal={closeModal}
					currentId={currentId}
					onClick={deleteAccount}
					onCancel={() => openModal(USER_PROFILE_MODAL)}
					id={DELETE_ACCOUNT_CONF_MODAL}
					header={
						<section className="p-3 pb-0 text-rose-400 font-bold text-xl">
							<i className="uil uil-exclamation-triangle text-xl text-rose-400 mr-2"></i>
							{EN_US['profile.DeleteAccountHeader']}"{user.name}" ?
						</section>
					}
					message={EN_US['profile.DeleteAccountMessage']}
				></ConfirmModal>
			</Card>
		</Modal>
	);
};

//TODO: MOVE TO CORE
export const InfoItem = ({
	name,
	value,
	vstyle,
}: {
	vstyle?: string;
	name: string;
	value: string;
}) => {
	return (
		<p className=" flex justify-between items-center">
			<span className="text-gray-800 dark:text-neutral-200">{name}:</span>{' '}
			<span className={'text-gray-500 dark:text-neutral-300 ' + (vstyle ?? '')}>{value}</span>
		</p>
	);
};
