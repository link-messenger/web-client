import { formatDateTime, formatTime } from 'utils/time';

export const MessageBox = ({
	uid,
	content,
	user,
	created,
}: {
	created: string;
	user: {
		id: string;
		username: string;
	};
	content: string;
	uid: string;
}) => {
	const time = formatTime(created);
	const isMe = user.id === uid;
	return (
		<section
			className={'flex flex-col gap-0.5' + (isMe ? ' self-end items-end' : '')}
		>
			<section
				className={
					'w-fit flex items-baseline justify-between gap-3' +
					(isMe ? ' flex-row-reverse' : '')
				}
			>
				<h6 className="font-bold capitalize text-sm text-gray-700">
					{isMe ? 'You' : user.username}
				</h6>
				<span
					className={
						'text-xs text-gray-400 font-medium' + (isMe ? ' self-end' : '')
					}
				>
					{time}
				</span>
			</section>
			<section
				className={
					'max-w-xl w-fit p-3 rounded-lg' +
					(isMe
						? ' rounded-br-sm bg-blue-500 text-white self-end'
						: ' bg-gray-200 rounded-tl-sm text-gray-800')
				}
			>
				<p className="text-sm">{content}</p>
			</section>
		</section>
	);
};
