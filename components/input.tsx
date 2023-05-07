import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
  onClick?: () => void;
  type: string;
  kind?: 'text' | 'price';
  name: string;
  label: string;
  required?: boolean;
  register: UseFormRegisterReturn;
}

export default function Input({
  onClick,
  type,
  kind,
  name,
  label,
  required,
  register
}: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      {kind === 'text' && (
        <div className="relative flex items-center rounded-md shadow-sm">
          <input
            onClick={onClick}
            id={name}
            type={type}
            required={required}
            {...register}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
        </div>
      )}
      {kind === 'price' && (
        <div className="relative flex items-center  rounded-md shadow-sm">
          <div className="pointer-events-none absolute left-0 flex items-center justify-center pl-3">
            <span className="text-sm text-gray-500">$</span>
          </div>
          <input
            id={name}
            type={type}
            required={required}
            {...register}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pl-7 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
        </div>
      )}
    </div>
  );
}

Input.defaultProps = {
  onClick: () => {},
  kind: 'text',
  required: false
};
