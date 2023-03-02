import {
  InputHTMLAttributes,
  useState,
} from 'react';

interface INoramlInput
  extends InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}
export const NormalInput = ({
  icon,
  id,
  className,
  ...others
}: INoramlInput) => {
  return (
    <section className="flex items-center bg-slate-100 p-1.5 w-full rounded-xl">
      <label
        htmlFor={id}
        className="bg-white rounded-lg w-12 aspect-square text-lg grid place-items-center text-sky-600"
      >
        {icon}
      </label>
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
        icon={
          <i className="uil uil-keyhole-circle"></i>
        }
        type={visible ? 'text' : 'password'}
        {...others}
      />
      <i
        onClick={() => setVisible(!visible)}
        className="uil uil-eye absolute z-10 cursor-pointer text-gray-700 text-xl top-1/2 -translate-y-1/2 right-3.5"
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
        'outline-none bg-transparent focus:outline-none border-none focus:border-none ' +
        (className ?? '')
      }
      {...others}
    />
  );
};
