import { forwardRef, LegacyRef } from 'react';
import { IMessage } from 'store';
import { formatTime } from 'utils/time';

interface IMessageBoxProps extends IMessage {
	uid: string;
}

const MessageBoxComponent = (
	{ uid, sender, updatedAt, content }: IMessageBoxProps,
	ref: LegacyRef<HTMLElement>
) => {
	const time = formatTime(updatedAt);
	const isMe = sender._id === uid;
	return (
		<section
			className={'flex flex-col gap-0.5' + (isMe ? ' self-end items-end' : '')}
			ref={ref}
		>
			{!isMe && <h6 className="font-bold capitalize text-sm text-gray-700 dark:text-neutral-100">
				{sender.name}
			</h6>}
			<p
				className={
					'whitespace-pre-line max-w-xl w-fit p-3 rounded-lg' +
					(isMe
						? ' rounded-br-sm bg-primary text-white self-end'
						: ' bg-gray-200 dark:bg-lighter-gray dark:text-neutral-200 rounded-tl-sm text-gray-800')
				}
			>
				{content}
			</p>
			<span
				className={
					'text-xs text-gray-400 font-medium' + (isMe ? ' self-end' : '')
				}
			>
				{time}
			</span>
		</section>
	);
};

export const MessageBox = forwardRef(MessageBoxComponent);

const DateTagComponent = (
	{ date }: { date: string },
	ref: LegacyRef<HTMLElement>
) => {
	return (
		<section ref={ref} className="flex justify-between items-center gap-4">
			<span className="border-b dark:border-lighter-gray border-gray-200 flex-grow"></span>
			<span className="bg-gray-200 dark:bg-lighter-gray dark:text-gray-300 text-gray-500 text-xs px-2 py-0.5 rounded-full">
				{date}
			</span>
			<span className="border-b dark:border-lighter-gray border-gray-200 flex-grow"></span>
		</section>
	);
};

export const DateTag = forwardRef(DateTagComponent);
