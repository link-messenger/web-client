import { useField } from "formik";
import { HTMLAttributes, InputHTMLAttributes } from "react"


export const Toggle = ({
	id,
  name,
  value,
	...others
}: InputHTMLAttributes<HTMLInputElement>) => {
  const [,,{setValue}] = useField(name as string);
  return (
		<label
			htmlFor={id}
			onClick={() => setValue(!value)}
			className={
				'relative w-14 h-7  rounded-full cursor-pointer ' +
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
					'bg-white w-5 top-1/2 -translate-y-1/2 aspect-square absolute z-50 rounded-full ' +
					(value ? 'right-1' : 'left-1')
				}
			></span>
		</label>
	);
};