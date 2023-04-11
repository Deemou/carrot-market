import cls from '@libs/client/utils';
import { MouseEventHandler } from 'react';

interface ButtonProps {
  large?: boolean;
  long?: boolean;
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  [key: string]: any;
}

export default function Button({
  large,
  long,
  onClick,
  text,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      {...rest}
      onClick={onClick}
      className={cls(
        'rounded-md border border-gray-200 px-3 text-sm font-medium hover:bg-gray-200 hover:text-black',
        large ? 'py-2.5' : 'py-1.5',
        long ? 'w-full' : ''
      )}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  large: false,
  long: true,
  type: 'submit',
  onClick: undefined
};
