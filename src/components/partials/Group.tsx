import { Button, Card, NormalInput, Toggle } from 'components/core';
import { Modal } from 'components/core/Modal';
import {
	CREATE_GROUP_INITIALS,
	CREATE_GROUP_MODAL,
	CREATE_GROUP_VALIDATION,
} from 'constants';
import { Field, Form, Formik } from 'formik';
import { useCreateGroup } from 'hooks';
import { EN_US } from 'languages';
import { useChatStore } from 'store';

export const CreateGroupModal = ({
	closeModal,
	currentId,
}: {
	currentId: string;
	closeModal: (id: string) => void;
}) => {
	const setCurrentChat = useChatStore((state) => state.setCurrentChat);
	const { mutateAsync } = useCreateGroup();
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
								setCurrentChat({
									id: data._id,
									name: data.name,
									members: data.members,
									type: 'group',
								});
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
