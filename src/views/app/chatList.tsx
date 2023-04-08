import { ChatList, MainListWrapper } from 'components';
import { useGetUserProfile } from 'hooks';
import { EN_US } from 'languages';

const Chat = () => {
	const { data: userData } = useGetUserProfile();
	return (
		<MainListWrapper title={EN_US['chat.Chats']}>
			<ChatList uid={userData?.id} />
		</MainListWrapper>
	);
};

export default Chat;
