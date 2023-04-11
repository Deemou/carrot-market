/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextPage } from 'next';
import Image from 'next/image';
import useSWR from 'swr';
import { Review, User } from '@prisma/client';
import cls from '@libs/client/utils';
import Layout from '@/components/layout';
import { useRouter } from 'next/router';
import Tab from '@/components/profile/tab';

interface UserResponse {
  ok: boolean;
  user: User;
}
interface ReviewWithUser extends Review {
  createdBy: User;
}
interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

const Profile: NextPage = () => {
  const router = useRouter();
  const { data: userData } = useSWR<UserResponse>(
    `/api/users/${router.query.id}`
  );
  const { data: reviewData } = useSWR<ReviewsResponse>('/api/reviews');
  return (
    <Layout seoTitle="Profile">
      <div className="px-4">
        <div className="mt-4 flex items-center space-x-3">
          {userData?.user.avatar ? (
            <div className="relative h-14 w-14">
              <Image
                src={userData.user.avatar}
                fill
                alt="avatar"
                priority
                className="rounded-full bg-transparent object-cover"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-full bg-orange-500" />
          )}
          <div className="flex flex-col">
            <span className="text-lg font-medium ">{userData?.user.name}</span>
          </div>
        </div>
        <div className="mt-10 flex justify-around">
          <Tab href={`/profile/${userData?.user.id}/sold`} text="판매중인 상품">
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
        </div>
        {reviewData?.reviews?.map((review) => (
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
