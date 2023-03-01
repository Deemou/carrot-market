/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { NextPage } from 'next';
import Chat from '@/components/chat';
import { Stream } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '@/components/layout';

interface StreamProps extends Stream {
  chat: { id: string };
}

interface StreamResponse {
  ok: true;
  stream: StreamProps;
  lastPage: number;
}

const LiveStream: NextPage = () => {
  const router = useRouter();
  const requestUrl = `/api/streams/${router.query.id}`;
  const { data } = useSWR<StreamResponse>(
    router.query.id ? `${requestUrl}` : null
  );
  return (
    <Layout>
      <div className="space-y-4 py-10">
        <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="mt-3 block text-2xl text-gray-900">
            ${data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
        </div>
        <Chat title="Live Chat" chatId={data?.stream?.chat?.id} />
      </div>
    </Layout>
  );
};

export default LiveStream;
