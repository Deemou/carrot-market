import { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
  name?: string;
  label?: string;
  required?: boolean;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

export default function TextArea({
  name,
  label,
  required,
  register,
  ...rest
}: TextAreaProps) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        id={name}
        required={required}
        {...register}
        rows={4}
        {...rest}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
      />
    </div>
  );
}

TextArea.defaultProps = {
  name: '',
  label: '',
  required: false
};
