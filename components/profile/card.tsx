import { useEffect, useState } from 'react';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import { pageTypeAtom } from '@/atoms';
import MenuButton from '../common/button/menu-button';
import DeleteWarningModal from '../common/delete-warning-modal';
import MenuModal from '../common/button/menu-modal';
import ProfileInfo from './profile-info';

interface CardProps {
  avatar: string | null;
  userId: number;
  userName: string | null;
  postId: number;
}

interface Response {
  ok: boolean;
}

export default function Card({ avatar, userId, userName, postId }: CardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isDeleteMenuClicked, setIsDeleteMenuClicked] = useState(false);
  const pageType = useRecoilValue(pageTypeAtom);

  const postUrl = `/api/${pageType}/${postId}`;
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
    if (pageType === 'products') router.push(`/products/${postId}/edit/`);
    else if (pageType === 'community') router.push(`/community/${postId}/edit`);
  };

  useEffect(() => {
    if (!deleteData?.ok) return;
    if (pageType === 'products') router.push('/');
    else if (pageType === 'community') router.push('/community');
  }, [deleteData, pageType, router]);

  return (
    <div className="flex justify-between border-b border-t py-3">
      <ProfileInfo avatar={avatar} userId={userId} userName={userName} />
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
