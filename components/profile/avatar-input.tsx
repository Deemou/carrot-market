import Avatar from '@/components/common/avatar';
import { UseFormRegisterReturn } from 'react-hook-form';

interface AvatarInputProps {
  avatarPreview: string;
  register: UseFormRegisterReturn;
}

export default function AvatarInput({
  avatarPreview,
  register
}: AvatarInputProps) {
  return (
    <div className="flex items-center space-x-3">
      <Avatar url={avatarPreview} />
      <label
        htmlFor="picture"
        tabIndex={0}
        role="button"
        className="cursor-pointer rounded-md border border-gray-200 px-2 py-2 hover:bg-gray-200 hover:text-black"
      >
        Change
        <input
          id="picture"
          type="file"
          accept="image/*"
          {...register}
          className="hidden"
        />
      </label>
    </div>
  );
}
