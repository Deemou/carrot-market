/* eslint-disable no-void */
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
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
import Layout from '@/components/layout';
import Button from '@components/button';
import Input from '@components/input';
import Avatar from '@/components/avatar';
import EmailForm from '@/components/form/email-form';
import TokenForm from '@/components/form/token-form';

interface EditProfileForm {
  email?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const imageSizeKB = 300;
const imageSize = imageSizeKB * 1024;

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const [isEmailOk, setIsEmailOk] = useState(false);
  const [isTokenOk, setIsTokenOk] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<EditProfileForm>();
  const [imageFile, setImageFile] = useState<FileList>();
  const [avatarPreview, setAvatarPreview] = useState('');
  const avatarWatch = watch('avatar');

  useEffect(() => {
    if (user?.name) setValue('name', user.name);
    if (user?.email) setValue('email', user.email);
    if (user?.avatar) setAvatarPreview(user.avatar);
  }, [user, setValue]);

  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);
  const onValid = ({ name }: EditProfileForm) => {
    if (loading) return;

    if (!imageFile || imageFile.length < 1) {
      editProfile({ name });
      return;
    }

    const storageService = getStorage(firebase);
    const imageRef = ref(storageService, `avatar/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(imageRef, imageFile[0]);
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
            name,
            avatar: url
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

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError('formErrors', { message: data.error });
    }
  }, [data, setError]);

  useEffect(() => {
    if (!isTokenOk) return;

    setIsEmailOk(false);
    setIsTokenOk(false);
  }, [isTokenOk]);

  return (
    <Layout seoTitle="Edit Profile">
      <div className="px-4 py-10">
        <form
          onSubmit={(...args) => void handleSubmit(onValid)(...args)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Avatar url={avatarPreview} large />
            <label
              htmlFor="picture"
              className="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-200 hover:text-black"
            >
              Change
              <input
                {...register('avatar')}
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
          <Input
            register={register('name')}
            required
            label="Name"
            name="name"
            type="text"
          />
          {errors.formErrors && (
            <span className="my-2 block text-center font-medium text-red-500">
              {errors.formErrors.message}
            </span>
          )}
          <Button text={loading ? 'Loading...' : 'Update'} />
        </form>
        {!isEmailOk && (
          <EmailForm setIsEmailOk={setIsEmailOk}>
            <Button text="Change Email" />
          </EmailForm>
        )}
        {isEmailOk && !isTokenOk && <TokenForm setIsTokenOk={setIsTokenOk} />}
      </div>
    </Layout>
  );
};

export default EditProfile;
