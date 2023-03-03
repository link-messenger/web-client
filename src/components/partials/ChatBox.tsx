import { useGetUserById } from "hooks";
import { formatTime } from "utils/time";

export const MessageBox = ({uid, content, user, created}:{created: string,user: string,content: string,uid: string}) => {
  const time = formatTime(created);
  const isMe = user === uid;
	const { data: userData } = useGetUserById({ id: user });
  return (
		<section
			className={
				'flex flex-col gap-1.5' + (isMe ? ' self-end' : '')
			}
		>
			<section
				className={
					'bg-gray-100 max-w-xl w-fit p-3 rounded-xl' +
					(user === uid
						? ' rounded-br-sm bg-blue-500 text-white self-end'
						: ' rounded-bl-sm text-gray-800')
				}
			>
				<h6 className="font-medium capitalize">{userData?.username}</h6>
				<p className="text-sm">{content}</p>
			</section>
			<span
				className={
					'text-xs text-gray-400 font-medium' +
					(isMe ? ' self-end' : '')
				}
			>
				{time}
			</span>
		</section>
	);
}