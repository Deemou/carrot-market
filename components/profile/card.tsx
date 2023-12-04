import Link from 'next/link';
import { useEffect, useState } from 'react';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Avatar from '@/components/common/avatar';
import { useSession } from 'next-auth/react';
import MenuButton from '../common/button/menu-button';
import DeleteWarningModal from '../common/delete-warning-modal';
import MenuModal from '../common/button/menu-modal';

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
          <div className="relative">
            {+session.user.id === userId && (
              <MenuButton onClick={onMenuClick} />
            )}
            {isMenuClicked && (
              <MenuModal
                onOverlayClick={onOverlayClick}
                onEditClick={onEditClick}
                onDeleteMenuClick={onDeleteMenuClick}
              />
            )}
          </div>
          {isDeleteMenuClicked && (
            <DeleteWarningModal
              type="Post"
              onDeleteOverlayClick={onDeleteOverlayClick}
              onDeleteClick={onDeleteClick}
            />
          )}
        </>
      )}
    </div>
  );
}
