/* eslint-disable jsx-a11y/anchor-is-valid */
import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';

const Chats: NextPage = () => {
  return (
    <Layout seoTitle="Chat">
      <div className="divide-y-[1px] ">
        {new Array(12).fill(1).map((_, i) => (
          <Link
            href={`/chats/${i}`}
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="flex cursor-pointer items-center space-x-3 px-4 py-3"
          >
            <div className="h-12 w-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-gray-700">Steve Jebs</p>
              <p className="text-sm  text-gray-500">
                See you tomorrow in the corner at 2pm!
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
