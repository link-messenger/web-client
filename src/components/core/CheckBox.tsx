import { useField } from 'formik';
import { HTMLAttributes, InputHTMLAttributes } from 'react';

interface ToggleProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
	sm: 'w-10 h-5',
	md: 'w-14 h-7',
	lg: 'w-20 h-10',
};

const CIRCLE_SIZE_MAP = {
	sm: 'w-4',
	md: 'w-5',
	lg: 'w-6',
};

const CIRCLE_LEFT_SIZE_MAP = {
	sm: 'left-0.5',
	md: 'left-1',
	lg: 'left-1.5',
};
const CIRCLE_RIGHT_SIZE_MAP = {
	sm: 'right-0.5',
	md: 'right-1',
	lg: 'right-1.5',
};

export const Toggle = ({
	id,
	name,
	value,
	size = 'md',
	...others
}: ToggleProps) => {
	const [, , { setValue }] = useField(name as string);
	return (
		<label
			htmlFor={id}
			onClick={() => setValue(!value)}
			className={
				SIZE_MAP[size] +
				' relative rounded-full cursor-pointer ' +
				(value ? 'bg-sky-400' : 'bg-slate-100')
			}
		>
			<input
				type="checkbox"
				name={name}
				value={value}
				{...others}
				className="hidden"
			/>
			<span
				className={
					CIRCLE_SIZE_MAP[size] +
					' bg-white top-1/2 -translate-y-1/2 aspect-square absolute z-50 rounded-full ' +
					(value ? CIRCLE_RIGHT_SIZE_MAP[size] : CIRCLE_LEFT_SIZE_MAP[size])
				}
			></span>
		</label>
	);
};

interface ToggleWithoutFormikProps extends Omit<ToggleProps, 'value'> {
	onTogglePress?: any;
	value: boolean;
}

export const ToggleWithoutFormik = ({
	id,
	name,
	value,
	size = 'md',
	onTogglePress,
	...others
}: ToggleWithoutFormikProps) => {
	return (
		<label
			onClick={onTogglePress}
			htmlFor={id}
			className={
				SIZE_MAP[size] +
				' relative rounded-full cursor-pointer ' +
				(value ? 'bg-sky-400' : 'bg-slate-100')
			}
		>
			<input
				type="checkbox"
				name={name}
				defaultChecked={value}
				{...others}
				className="hidden"
			/>
			<span
				className={
					CIRCLE_SIZE_MAP[size] +
					' bg-white top-1/2 -translate-y-1/2 aspect-square absolute z-50 rounded-full ' +
					(value ? CIRCLE_RIGHT_SIZE_MAP[size] : CIRCLE_LEFT_SIZE_MAP[size])
				}
			></span>
		</label>
	);
};
