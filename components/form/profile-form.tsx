import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useUser from '@libs/client/useUser';
import useMutation from '@libs/client/useMutation';
import { v4 as uuidv4 } from 'uuid';
import firebase from '@libs/server/firebase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import Button from '@components/button';
import AvatarInput from '@components/input/avatar-input';
import { useRouter } from 'next/router';
import NameInput from '@components/input/name-input';
import { getAvatarImage } from '@/libs/client/image';

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
  const { user } = useUser();

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

  useEffect(() => {
    if (user?.avatar) setAvatarPreview(user.avatar);
    if (user?.name) setValue('name', user.name);
  }, [user, setValue]);

  const [editProfile, { data, loading }] =
    useMutation<MutationResult>(`/api/users/me`);

  const onClick = () => {
    clearErrors('formErrors');
  };

  const onValid = async ({ name }: EditProfileForm) => {
    if (loading) return;
    if (!imageFile || imageFile.length < 1) {
      editProfile({ name });
      return;
    }

    const image = await getAvatarImage(avatarPreview);
    const storageService = getStorage(firebase);
    const imageRef = ref(storageService, `avatar/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(imageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused.');
            break;
          case 'running':
            console.log('Upload is running.');
            break;
          default:
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        void getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          editProfile({
            avatar: url,
            name
          });
        });
      }
    );
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
    if (data?.ok) {
      void router.push(`/profile`);
    }
  }, [data, router]);

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onValid)(...args)}
      className="space-y-4"
    >
      <AvatarInput
        avatarPreview={avatarPreview}
        register={register('avatar')}
      />
      <NameInput onClick={onClick} register={register} errors={errors} />
      <Button text={loading ? 'Loading...' : 'Update'} />
    </form>
  );
}
