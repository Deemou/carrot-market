/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextPage } from 'next';
import Link from 'next/link';
import useUser from '@libs/client/useUser';
import useSWR from 'swr';
import { Review, User } from '@prisma/client';
import cls from '@libs/client/utils';
import Layout from '@/components/layout';
import Tab from '@/components/profile/tab';
import Avatar from '@/components/avatar';

interface ReviewWithUser extends Review {
  createdBy: User;
}
interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

const Profile: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<ReviewsResponse>('/api/reviews');
  return (
    <Layout seoTitle="Profile">
      <div className="px-4">
        <div className="mt-4 flex items-center space-x-3">
          <Avatar url={user?.avatar} large />
          <div className="flex flex-col">
            <span className="font-medium ">{user?.name}</span>
            <Link href="/profile/edit" className="text-sm text-gray-400">
              Edit profile &rarr;
            </Link>
          </div>
        </div>
        <div className="mt-10 flex">
          <Tab href="/profile/sold" text="판매중인 상품" className="w-1/3">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </Tab>
          <Tab href="/profile/bought" text="구매내역" className="w-1/3">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </Tab>
          <Tab href="/profile/loved" text="관심목록" className="w-1/3">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </Tab>
        </div>
        {data?.reviews?.map((review) => (
          <div key={review.id} className="mt-12">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-slate-500" />
              <div>
                <h4 className="text-sm font-bold ">{review.createdBy.name}</h4>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={cls(
                        'h-5 w-5',
                        review.score >= star
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      )}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>{review.review}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Profile;
