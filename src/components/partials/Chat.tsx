import { forwardRef, LegacyRef } from 'react';
import { IMessage } from 'store';
import { formatTime } from 'utils/time';

interface IMessageBoxProps extends IMessage {
	uid: string;
	userHidden?: boolean;
}

const MessageBoxComponent = (
	{ uid, sender, updatedAt, content, userHidden }: IMessageBoxProps,
	ref: LegacyRef<HTMLElement>
) => {
	const time = formatTime(updatedAt);
	const isMe = sender._id === uid;
	return (
		<section
			className={'flex flex-col gap-0.5' + (isMe ? ' self-end items-end' : '')}
			ref={ref}
		>
			{(!isMe && !userHidden) && (
				<h6 className="font-medium capitalize text-sm text-gray-700 dark:text-neutral-200">
					{sender.name}
				</h6>
			)}
			<p
				className={
					'w-fit whitespace-pre-line break-all py-1.5 px-2 rounded-lg ' +
					(isMe
						? 'rounded-br-sm bg-primary text-white self-end'
						: 'bg-gray-200 dark:bg-dark-lighter-gray dark:text-neutral-200 rounded-tl-sm text-gray-800')
				}
			>
				{content}
			</p>
			<span className="text-xs text-gray-400">{time}</span>
		</section>
	);
};

export const MessageBox = forwardRef(MessageBoxComponent);

const DateTagComponent = (
	{ date }: { date: string },
	ref: LegacyRef<HTMLElement>
) => {
	return (
		<span
			ref={ref}
			className="mx-auto my-1 bg-gray-200 dark:bg-dark-lighter-gray dark:text-gray-400 text-gray-500 text-xs px-2 py-0.5 rounded-full"
		>
			{date}
		</span>
	);
};

export const DateTag = forwardRef(DateTagComponent);
