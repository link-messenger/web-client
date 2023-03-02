import { ButtonHTMLAttributes } from 'react';

export const Button = ({
  className,
  children,
  ...others
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={
        'cursor-pointer block w-full capitalize enabled:bg-sky-500 disabled:bg-gray-300 text-white p-3.5 font-semibold rounded-lg ' +
        (className ?? '')
      }
      {...others}
    >
      {children}
    </button>
  );
};

export const SquareButton = ({
  className,
  children,
  ...others
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={'cursor-pointer shadow-blur rounded-lg overflow-hidden aspect-square relative bg-gray-800 ' + (className ?? '')}
      {...others}
    >
      {children}
    </button>
  );
};

