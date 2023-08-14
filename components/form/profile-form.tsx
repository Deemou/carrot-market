import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useMutation from '@libs/client/useMutation';
import { v4 as uuidv4 } from 'uuid';
import Button from '@/components/button/button';
import AvatarInput from '@components/input/avatar-input';
import { useRouter } from 'next/router';
import NameInput from '@components/input/name-input';
import { saveAvatar } from '@/libs/client/image';
import { useSession } from 'next-auth/react';

interface EditProfileForm {
  avatar?: FileList;
  name: string;
  formErrors?: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

const imageSizeKB = 1000;
const imageSize = imageSizeKB * 1024;

export default function ProfileForm() {
  const { data: session, update } = useSession();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors }
  } = useForm<EditProfileForm>();
  const [imageFile, setImageFile] = useState<FileList>();
  const [avatarPreview, setAvatarPreview] = useState('');
  const avatarWatch = watch('avatar');

  const [uName, setUName] = useState('');
  const [uAvatar, setUAvatar] = useState('');
  const [isUpdateDone, setIsUpdateDone] = useState(false);

  useEffect(() => {
    if (!session) return;
    const { user } = session;
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
      setUAvatar(user.avatar);
    }
    if (user?.name) setValue('name', user.name);
  }, [setValue, session]);

  const [editProfile, { data, loading }] =
    useMutation<MutationResult>(`/api/users/me`);

  const onClick = () => {
    clearErrors('formErrors');
  };

  const onValid = async ({ name }: EditProfileForm) => {
    if (loading) return;
    if (!imageFile || imageFile.length < 1) {
      editProfile({ name });
      setUName(name);
      return;
    }

    const storagePath = `avatar/${uuidv4()}`;
    const avatar = await saveAvatar(avatarPreview, storagePath);

    editProfile({
      avatar,
      name
    });
    setUName(name);
    setUAvatar(avatar);
  };

  useEffect(() => {
    if (
      avatarWatch &&
      avatarWatch?.length > 0 &&
      avatarWatch[0].size > imageSize
    ) {
      alert(`Please upload an image less than ${imageSizeKB}KB.`);
      return;
    }

    setImageFile(avatarWatch);
    if (imageFile && imageFile.length > 0) {
      setAvatarPreview(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile, avatarWatch]);

  const router = useRouter();
  useEffect(() => {
    const handleUpdate = async () => {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: uName,
          avatar: uAvatar
        }
      });
      setIsUpdateDone(true);
    };

    if (data?.ok) {
      handleUpdate();
    }
  }, [data, session, uAvatar, uName, update]);

  useEffect(() => {
    if (!isUpdateDone) return;

    router.push(`/profile`);
  }, [isUpdateDone, router]);

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <AvatarInput
        avatarPreview={avatarPreview}
        register={register('avatar')}
      />
      <NameInput onClick={onClick} register={register} errors={errors} />
      <Button text={loading ? 'Loading...' : 'Update'} />
    </form>
  );
}
