import cls from '@libs/client/utils';

interface ButtonProps {
  large?: boolean;
  long?: boolean;
  text: string;
  [key: string]: any;
}

export default function Button({
  large,
  long,
  onClick,
  text,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="submit"
      {...rest}
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
  long: true
};
