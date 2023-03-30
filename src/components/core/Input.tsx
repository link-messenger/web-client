import {
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	InputHTMLAttributes,
	KeyboardEvent,
	LegacyRef,
	RefObject,
	useRef,
	useState,
} from 'react';

interface INoramlInput extends InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
}
export const NormalInput = ({
	icon,
	id,
	className,
	...others
}: INoramlInput) => {
	return (
		<section className="flex items-center bg-slate-100 p-1.5 w-full rounded-xl">
			{icon && (
				<label
					htmlFor={id}
					className="bg-white rounded-lg w-12 aspect-square text-lg grid place-items-center text-sky-600"
				>
					{icon}
				</label>
			)}
			<input
				id={id}
				className={
					'outline-none ml-2 p-2 bg-transparent focus:bg-transparent autofill:bg-transparent block text-slate-700  w-full ' +
					(className ?? '')
				}
				{...others}
			/>
		</section>
	);
};

export const PasswordInput = ({
	...others
}: InputHTMLAttributes<HTMLInputElement>) => {
	const [visible, setVisible] = useState(false);
	return (
		<section className="relative">
			<NormalInput
				icon={<i className="uil uil-keyhole-circle"></i>}
				type={visible ? 'text' : 'password'}
				{...others}
			/>
			<i
				onClick={() => setVisible(!visible)}
				className={
					'absolute z-10 cursor-pointer text-gray-700 text-xl top-1/2 -translate-y-1/2 right-3.5' +
					(visible ? ' uil uil-eye-slash' : ' uil uil-eye')
				}
			></i>
		</section>
	);
};
export const PaleInput = ({
	className,
	...others
}: InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<input
			className={
				'outline-none w-full bg-transparent focus:outline-none border-none focus:border-none ' +
				(className ?? '')
			}
			{...others}
		/>
	);
};

export const SearchInput = ({
	id,
	type,
	...others
}: InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<section className="flex items-center bg-light-lighter-gray dark:bg-dark-light-gray py-2.5 space-x-4 px-4 w-full rounded-md">
			<input
				id={id}
				type="search"
				className="outline-none ml-1 bg-transparent placeholder:text-sm placeholder:text-gray-500 placeholder:dark:text-neutral-500 dark:text-gray-200 focus:bg-transparent autofill:bg-transparent block text-slate-700  w-full"
				{...others}
			/>
			<label
				htmlFor={id}
				className="rounded-lg aspect-square text-gray-400 text-lg grid place-items-center"
			>
				<button className="uil uil-search "></button>
			</label>
		</section>
	);
};

interface TextAreaProps extends HTMLAttributes<HTMLTextAreaElement> {
	inputRef: RefObject<HTMLTextAreaElement>;
}

export const TextArea = ({ className, inputRef, ...others }: TextAreaProps) => {
	// const inputRef = useRef<HTMLTextAreaElement>(null);

	return (
		<textarea
			ref={inputRef}
			rows={2}
			// onKeyDown={handleKeyDown}
			className={
				'bg-transparent h-5 scrollbar-hide resize-none ' + (className ?? '')
			}
			{...others}
		></textarea>
	);
};
