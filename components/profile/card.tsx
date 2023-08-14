import Link from 'next/link';
import cls from '@/libs/client/utils';
import { useEffect, useState } from 'react';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Avatar from '@components/avatar';
import { useSession } from 'next-auth/react';
import ThreeDotIcon from '../icon/three-dot-icon';
import EditIcon from '../icon/edit-icon';
import DeleteIcon from '../icon/delete-icon';

interface CardProps {
  avatar: string | null;
  userId: number;
  userName: string | null;
  postType: string;
  postId: number;
}

interface Response {
  ok: boolean;
}

export default function Card({
  avatar,
  userId,
  userName,
  postType,
  postId
}: CardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isDeleteMenuClicked, setIsDeleteMenuClicked] = useState(false);

  const postUrl = `/api/${postType}/${postId}`;
  const deleteUrl = `${postUrl}/delete`;

  const [deletePost, { loading: deleteLoading, data: deleteData }] =
    useMutation<Response>(deleteUrl);

  const onMenuClick = () => {
    setIsMenuClicked(true);
  };
  const onOverlayClick = () => {
    setIsMenuClicked(false);
  };
  const onDeleteMenuClick = () => {
    setIsMenuClicked(false);
    setIsDeleteMenuClicked(true);
  };
  const onDeleteOverlayClick = () => {
    setIsDeleteMenuClicked(false);
    setIsMenuClicked(true);
  };

  const onDeleteClick = () => {
    if (deleteLoading) return;
    deletePost({});
  };
  const onEditClick = () => {
    if (postType === 'products') router.push(`/products/${postId}/edit/`);
    else if (postType === 'posts') router.push(`/community/${postId}/edit`);
  };

  useEffect(() => {
    if (!deleteData?.ok) return;
    if (postType === 'products') router.push('/');
    else if (postType === 'posts') router.push('/community');
  }, [deleteData, postType, router]);

  return (
    <div className="flex justify-between border-b border-t py-3">
      <div className="my-3 flex items-center space-x-3">
        <Avatar url={avatar} />
        <div className="flex h-12 flex-col justify-between">
          <h4>{userName}</h4>
          <Link href={`/profile/${userId}`} className="text-gray-500">
            View profile &rarr;
          </Link>
        </div>
      </div>
      {session && (
        <>
          {/* menu */}
          <div className="relative">
            <button
              onClick={onMenuClick}
              type="button"
              className={cls(
                'aspect-square h-6 cursor-pointer',
                Number(session.user.id) === userId ? '' : 'hidden'
              )}
            >
              <ThreeDotIcon />
            </button>
            {isMenuClicked && (
              <div>
                {/* overlay */}
                <div
                  onClick={onOverlayClick}
                  className="fixed left-0 top-0 z-10 h-screen w-full opacity-0"
                  aria-hidden
                ></div>
                {/* modal */}
                <div className="absolute right-0 top-2 z-20 rounded-md bg-black ring-2 ring-gray-900">
                  {/* edit */}
                  <button
                    onClick={onEditClick}
                    type="button"
                    className="flex w-full cursor-pointer flex-row space-x-3 px-3 py-1.5 hover:bg-[#202020]"
                  >
                    <EditIcon />

                    <span>Edit</span>
                  </button>
                  {/* delete */}
                  <button
                    onClick={onDeleteMenuClick}
                    type="button"
                    className="flex cursor-pointer flex-row space-x-3 px-3 py-1.5 hover:bg-[#202020]"
                  >
                    <DeleteIcon />

                    <span className="text-[#ff0000]">Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* waring delete */}
          {isDeleteMenuClicked && (
            <div className="fixed left-0 top-0 z-20 flex min-h-screen w-screen">
              {/* overlay */}
              <div
                onClick={onDeleteOverlayClick}
                className="fixed bottom-0 left-0 right-0 top-0 z-30 h-screen w-full bg-slate-100 opacity-10"
                aria-hidden
              ></div>
              {/* modal */}
              <div className="relative z-40 mx-auto w-80 max-w-[80vw] space-y-5 self-center rounded-xl bg-black px-8 py-4 ring-2 ring-gray-900">
                <div className="space-y-2">
                  <h3 className="font-semibold">Delete Post?</h3>
                  <span className="block opacity-50">
                    This can&apos;t be undone.
                  </span>
                </div>
                <div className="flex flex-col space-y-3 py-2 font-semibold">
                  <button
                    onClick={onDeleteClick}
                    type="button"
                    className="rounded-md bg-red-600 p-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={onDeleteOverlayClick}
                    type="button"
                    className="rounded-md border p-2 hover:bg-[#202020]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
