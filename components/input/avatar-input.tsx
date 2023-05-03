import Avatar from '@/components/avatar';
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
      <Avatar url={avatarPreview} large />
      <label
        htmlFor="picture"
        className="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-200 hover:text-black"
      >
        Change
        <input
          {...register}
          id="picture"
          type="file"
          accept="image/*"
          className="hidden"
        />
      </label>
    </div>
  );
}
