import { Button, Card, NormalInput, Toggle } from 'components/core';
import { Modal } from 'components/core/Modal';
import {
	CHAT_INFO_MODAL,
	CREATE_GROUP_INITIALS,
	CREATE_GROUP_MODAL,
	CREATE_GROUP_VALIDATION,
} from 'constants';
import { Field, Form, Formik } from 'formik';
import { useCreateGroup, useGetUserGroupDetail } from 'hooks';
import { IGroupDetail, ModalCardProps } from 'interfaces';
import { EN_US } from 'languages';
import { GROUP_DETAIL_MOCK } from 'mock/chat';
import { useChatListStore, useChatStore } from 'store';
import { formatDateTime } from 'utils/time';
import { ListAvatar } from './Avatar';
import { InfoItem } from './Profile';

export const CreateGroupModal = ({ closeModal, currentId }: ModalCardProps) => {
	const { mutateAsync } = useCreateGroup();
	const addGroup = useChatListStore((state) => state.addGroup);
	return (
		<Modal
			className="justify-center items-center"
			onClick={() => closeModal(CREATE_GROUP_MODAL)}
			isOpen={currentId === CREATE_GROUP_MODAL}
		>
			<Card
				onClick={(e) => e.stopPropagation()}
				className="p-3 m-2 w-full md:w-[600px]"
			>
				<Formik
					initialValues={CREATE_GROUP_INITIALS}
					validationSchema={CREATE_GROUP_VALIDATION}
					onSubmit={(data, { resetForm }) => {
						mutateAsync({
							name: data.name,
							description: data.description,
							status: data.isPublic ? 'PUBLIC' : 'PRIVATE',
						})
							.then((data) => {
								resetForm();
								addGroup(data);
							})
							.finally(() => {
								closeModal(CREATE_GROUP_MODAL);
							});
					}}
				>
					{({ values, isValid }) => (
						<Form className="flex flex-col gap-3">
							<section className="flex p-2 items-start border-b border-gray-100">
								<section className="flex flex-col flex-1">
									<h4 className="text-gray-500 font-medium">
										{values.name || EN_US['settings.GroupName']}
									</h4>
									<p className="text-gray-300 text-sm">
										{values.description || EN_US['settings.GroupDesc']}
									</p>
								</section>
								<span className="text-sm mt-0.5 text-gray-400">
									{values.isPublic ? 'Public' : 'Private'}
								</span>
							</section>
							<Field
								as={NormalInput}
								placeholder="Group Name"
								name="name"
								id="name"
							/>
							<Field
								as={NormalInput}
								placeholder="Group Description"
								name="description"
								id="description"
							/>
							<section className="flex items-center justify-between">
								<span className="text-sm text-gray-600 font-medium">
									{EN_US['settings.GroupStatus']}
								</span>
								<Field as={Toggle} name="isPublic" id="isPublic" />
							</section>
							<p className="text-amber-600 text-sm bg-amber-50 p-3 rounded-xl">
								{values.isPublic
									? EN_US['settings.NotePublicGroup']
									: EN_US['settings.NotePrivateGroup']}
							</p>
							<Button disabled={!isValid}>{EN_US['settings.Create']}</Button>
						</Form>
					)}
				</Formik>
			</Card>
		</Modal>
	);
};

interface GroupProfileModalProps extends ModalCardProps {
	groupDetail: IGroupDetail;
}

export const GroupProfileModal = ({
	currentId,
	closeModal,
	groupDetail,
}: GroupProfileModalProps) => {
	const memberNumber =
		groupDetail.members.length > 1
			? `${groupDetail.members.length} ${EN_US['chat.Members']}`
			: `${groupDetail.members.length} ${EN_US['chat.Member']}`;
	const leave = useChatListStore(state => state.leaveGroup);
	const onLeaveGroup = () => {
		closeModal(CHAT_INFO_MODAL);
		leave(groupDetail._id);
	}
	return (
		<Modal
			className="justify-center items-center"
			isOpen={currentId === CHAT_INFO_MODAL}
			onClick={() => closeModal(CHAT_INFO_MODAL)}
		>
			<Card
				onClick={(e) => e.stopPropagation()}
				className="w-full m-2  md:w-[600px]"
			>
				<header className="p-3 border-b border-gray-100 flex gap-2 items-center">
					<ListAvatar username={groupDetail?.name} size="w-14" />
					<section className="flex flex-col">
						<span className="font-bold text-gray-700">{groupDetail?.name}</span>
						<span className="text-sm text-gray-400">{memberNumber}</span>
					</section>
				</header>

				<section className="p-3 border-b flex flex-col gap-1 text-sm border-gray-100">
					<section className="font-medium text-gray-700 flex items-center gap-2 h-fit">
						<i className="uil uil-comment-info text-xl"></i>
						<h5 className="font-medium">{EN_US['profile.Info']}</h5>
					</section>

					<section className="space-y-1">
						<p className="text-gray-800">{EN_US['profile.GroupDesc']}:</p>
						<p className="text-gray-600 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
							{groupDetail?.description}
						</p>
					</section>

					<InfoItem
						name={EN_US['profile.Link']}
						value={groupDetail?.link}
						vstyle="underline"
					/>
					<InfoItem
						name={EN_US['profile.Status']}
						vstyle="capitalize"
						value={groupDetail.status.toLowerCase()}
					/>
				</section>

				<section className="scrollbar-hide px-3 relative flex flex-col max-h-64 overflow-y-auto text-sm">
					<section className="text-gray-700 sticky top-0 w-full bg-white py-3 flex items-center gap-2 h-10">
						<i className="uil uil-users-alt text-xl"></i>
						<h4 className="font-medium">{memberNumber}</h4>
					</section>
					<section className="flex-grow flex flex-col gap-2">
						{groupDetail.members.map(({ user, role, _id }) => (
							<section key={_id} className="flex gap-3 ">
								<ListAvatar username={user.username} />
								<section className="flex-grow text-sm text-gray-400 flex flex-col justify-center">
									<p className="font-bold text-base text-gray-800">
										{user.name}
									</p>
									<p>{user.username}</p>
								</section>
								<span className="text-xs mt-0.5 text-gray-500 ">{role}</span>
							</section>
						))}
					</section>
				</section>
				<section className="p-3 mt-1 ">
					<Button onClick={onLeaveGroup} className="enabled:bg-rose-400">{EN_US['profile.Leave']}</Button>
				</section>
			</Card>
		</Modal>
	);
};