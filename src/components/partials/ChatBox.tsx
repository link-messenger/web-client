import { formatDateTime } from "utils/time";

export const MessageBox = ({ uid, content, user, created }: {
	created: string, user: {
		id: string;
		username: string;
},content: string,uid: string}) => {
  const time = formatDateTime(created);
  const isMe = user.id === uid;
  return (
		<section className={'flex flex-col gap-1.5' + (isMe ? ' self-end' : '')}>
			<section
				className={
					'max-w-xl w-fit p-3 rounded-xl' +
					(isMe
						? ' rounded-br-sm bg-blue-500 text-white self-end'
						: ' bg-gray-200 rounded-bl-sm text-gray-800')
				}
			>
				<h6 className="font-medium capitalize">{user.username}</h6>
				<p className="text-sm">{content}</p>
			</section>
			<span
				className={
					'text-xs text-gray-400 font-medium' + (isMe ? ' self-end' : '')
				}
			>
				{time}
			</span>
		</section>
	);
}