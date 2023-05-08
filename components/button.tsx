import cls from '@libs/client/utils';
import { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit';
  text: string;
  large?: boolean;
  long?: boolean;
  [key: string]: any;
}

export default function Button({
  onClick,
  type,
  text,
  large,
  long,
  ...rest
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type === 'button' ? 'button' : 'submit'}
      {...rest}
      className={cls(
        'rounded-md border border-gray-200 px-3 hover:bg-gray-200 hover:text-black',
        large ? 'py-2' : 'py-1',
        long ? 'w-full' : ''
      )}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  onClick: undefined,
  type: 'submit',
  large: false,
  long: true
};
