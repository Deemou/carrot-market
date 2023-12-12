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
import { COMMUNITY, PRODUCTS } from '@/pageTypes';
import { HOME_URL } from '@/routes';

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

  const postApiUrl = `/api/${pageType}/${postId}`;
  const deleteUrl = `${postApiUrl}/delete`;

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
    if (pageType === PRODUCTS) router.push(`/${PRODUCTS}/${postId}/edit/`);
    else if (pageType === COMMUNITY)
      router.push(`/${COMMUNITY}/${postId}/edit`);
  };

  useEffect(() => {
    if (!deleteData?.ok) return;
    if (pageType === PRODUCTS) router.push(HOME_URL);
    else if (pageType === COMMUNITY) router.push(`/${COMMUNITY}`);
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
