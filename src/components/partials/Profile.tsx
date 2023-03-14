import { Card, Modal } from 'components/core';
import { CREATE_GROUP_MODAL, USER_PROFILE_MODAL } from 'constants';
import { useGetUserProfile } from 'hooks';
import { ModalCardProps } from 'interfaces';
import { EN_US } from 'languages';
import { formatDateTime } from 'utils/time';
import { ListAvatar } from './Avatar';

export const EditUserProfileModal = ({
	closeModal,
	currentId,
}: ModalCardProps) => {
	const { data: user } = useGetUserProfile();
	if (!user) return <>loading...</>
	const createdAt = formatDateTime(user.createdAt);
	const updatedAt = formatDateTime(user.updatedAt);

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
				<header className="border-b border-b-gray-100 p-3 flex items-center">
					<ListAvatar size="w-16" username={user.name} />
					<div className="flex flex-col ml-3 gap-1">
						<h1 className="text-lg font-semibold text-gray-800">{user.name}</h1>
						<p className="text-sm  underline text-gray-500">#{user.username}</p>
					</div>
				</header>
				<section className="p-3">
					<h3 className="text-gray-800 font-medium text-lg mb-3">
						{EN_US['settings.ProfileInfo']}
					</h3>
					<InfoItem name={EN_US['settings.Id']} value={user.id} />
					<InfoItem name={EN_US['settings.Email']} value={user.email} />
					<InfoItem name={EN_US['settings.CreateAccDate']} value={createdAt} />
					<InfoItem name={EN_US['settings.AccLastUpdate']} value={updatedAt} />
			
				</section>
			</Card>
		</Modal>
	);
};

//TODO: MOVE TO CORE
export const InfoItem = ({ name, value, vstyle }: { vstyle?: string,name: string, value: string }) => {
	return (
		<p className=" flex justify-between items-center">
			<span className="text-gray-800">{name}:</span> <span className={'text-gray-500 ' + (vstyle ?? '')}>{value}</span>
		</p>
	);
}