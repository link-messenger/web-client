import { useField } from 'formik';
import { HTMLAttributes, InputHTMLAttributes } from 'react';
import { motion, Variants } from 'framer-motion';

type ToggleSize = 'sm' | 'md' | 'lg';

interface ToggleProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	size?: ToggleSize;
}

const SIZE_MAP = {
	sm: 'w-10 h-5',
	md: 'w-14 h-7',
	lg: 'w-20 h-10',
};

const CIRCLE_SIZE_MAP = {
	sm: 'w-4',
	md: 'w-5',
	lg: 'w-7',
};

const CIRCLE_LEFT_SIZE_MAP = {
	sm: '2px',
	md: '4px',
	lg: '6px',
};
const CIRCLE_RIGHT_SIZE_MAP = {
	sm: '22px',
	md: '32px',
	lg: '46px',
};

const toggleVariant = (size: ToggleSize): Variants => ({
	unchecked: {
		left: CIRCLE_LEFT_SIZE_MAP[size],
		transition: {
			duration: 0.1,
			ease: 'linear',
		},
	},
	checked: {
		left: CIRCLE_RIGHT_SIZE_MAP[size],
		transition: {
			duration: 0.1,
			ease: 'linear',
		},
	},
});

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
			<motion.span
				variants={toggleVariant(size)}
				animate={value ? 'checked' : 'unchecked'}
				className={
					CIRCLE_SIZE_MAP[size] +
					' bg-white top-1/2 -translate-y-1/2 aspect-square absolute z-50 rounded-full '
				}
			></motion.span>
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
			<motion.span
				variants={toggleVariant(size)}
				animate={value ? 'checked' : 'unchecked'}
				className={
					CIRCLE_SIZE_MAP[size] +
					' bg-white top-1/2 -translate-y-1/2 aspect-square absolute z-50 rounded-full '
				}
			></motion.span>
		</label>
	);
};
