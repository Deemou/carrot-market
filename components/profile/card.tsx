/* eslint-disable no-void */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Link from 'next/link';
import useUser from '@/libs/client/useUser';
import cls from '@/libs/client/utils';
import { useEffect, useState } from 'react';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Avatar from '../avatar';

interface CardProps {
  avatar: string | null;
  userId: number;
  userName: string;
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
  const { user } = useUser();
  const router = useRouter();
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const postUrl = `/api/${postType}/${postId}`;
  const deleteUrl = `${postUrl}/delete`;

  const [deletePost, { loading: deleteLoading, data: deletetData }] =
    useMutation<Response>(deleteUrl);

  const onMenuClick = () => {
    setIsMenuClicked(true);
  };
  const onOverlayClick = () => {
    setIsMenuClicked(false);
  };

  const onDeleteClick = () => {
    if (deleteLoading) return;
    deletePost({});
  };

  useEffect(() => {
    if (deletetData?.ok) {
      if (postType === 'products') void router.push('/');
      else if (postType === 'posts') void router.push('/community');
    }
  }, [deletetData, postType, router]);

  return (
    <div className="flex justify-between border-t border-b py-3">
      <div className="flex items-center space-x-3 py-3">
        <Avatar url={avatar} large />
        <div>
          <p className="font-medium">{userName}</p>
          <Link
            href={`/profile/${userId}`}
            className="text-xs font-medium text-gray-500"
          >
            View profile &rarr;
          </Link>
        </div>
      </div>
      {user && (
        <div className={cls('relative', user.id === userId ? '' : 'hidden')}>
          <svg
            onClick={onMenuClick}
            className="cursor-pointer"
            fill="#ffffff"
            width="22px"
            height="22px"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 128 128"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="64" cy="90.358" r="9.824" />
            <circle cx="99.25" cy="90.358" r="9.824" />
            <circle cx="28.75" cy="90.358" r="9.824" />
          </svg>
          {/* modal */}
          {isMenuClicked && (
            <div>
              <div
                onClick={onOverlayClick}
                className="fixed top-0 left-0 z-40 h-screen w-full opacity-0"
              ></div>
              <div className="absolute top-2 right-0 z-50 rounded-md bg-black ring-2 ring-gray-900">
                <div className="flex cursor-pointer flex-row space-x-3 px-3 py-1.5 hover:bg-[#080808]">
                  <svg
                    fill="#ffffff"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z" />
                  </svg>
                  <span>Edit</span>
                </div>
                <div
                  onClick={onDeleteClick}
                  className="flex cursor-pointer flex-row space-x-3 px-3 py-1.5 hover:bg-[#080808]"
                >
                  <svg
                    fill="#ff0000"
                    baseProfile="tiny"
                    height="24px"
                    id="Layer_1"
                    version="1.2"
                    viewBox="0 0 24 24"
                    width="24px"
                    xmlSpace="preserve"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path d="M18,7h-1V6c0-1.104-0.896-2-2-2H8C6.896,4,6,4.896,6,6v1H5C4.448,7,4,7.448,4,8s0.448,1,1,1v8c0,2.206,1.794,4,4,4h5   c2.206,0,4-1.794,4-4V9c0.552,0,1-0.448,1-1S18.552,7,18,7z M8,6h7v1H8V6z M16,17c0,1.104-0.896,2-2,2H9c-1.104,0-2-0.896-2-2V9h1   h7h1V17z" />
                      <path d="M8.5,10.5C8.225,10.5,8,10.725,8,11v6c0,0.275,0.225,0.5,0.5,0.5S9,17.275,9,17v-6C9,10.725,8.775,10.5,8.5,10.5z" />
                      <path d="M10.5,10.5c-0.275,0-0.5,0.225-0.5,0.5v6c0,0.275,0.225,0.5,0.5,0.5S11,17.275,11,17v-6C11,10.725,10.775,10.5,10.5,10.5z" />
                      <path d="M12.5,10.5c-0.275,0-0.5,0.225-0.5,0.5v6c0,0.275,0.225,0.5,0.5,0.5S13,17.275,13,17v-6C13,10.725,12.775,10.5,12.5,10.5z" />
                      <path d="M14.5,10.5c-0.275,0-0.5,0.225-0.5,0.5v6c0,0.275,0.225,0.5,0.5,0.5S15,17.275,15,17v-6C15,10.725,14.775,10.5,14.5,10.5z" />
                    </g>
                  </svg>
                  <span className="text-[#ff0000]">Delete</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
