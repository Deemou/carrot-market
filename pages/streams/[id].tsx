import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stream } from '@prisma/client';
import useSWR from 'swr';
import Layout from '@/components/layout';
import Chat from '@/components/chat';
import client from '@/libs/server/client';

interface StreamProps extends Stream {
  chat: { id: string };
}

interface StreamResponse {
  ok: true;
  stream: StreamProps;
}

const LiveStream: NextPage<StreamResponse> = (props) => {
  const router = useRouter();
  const requestUrl = `/api/streams/${router.query.id}`;
  const { data } = useSWR<StreamResponse>(`${requestUrl}`, {
    fallbackData: props
  });
  return (
    <Layout seoTitle="Stream Detail">
      <div className="space-y-4 py-10">
        <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
        <div className="mt-5">
          <h2>{data?.stream?.name}</h2>
          <span className="mt-3 block">${data?.stream?.price}</span>
          <p className=" my-6">{data?.stream?.description}</p>
        </div>
        <Chat title="Live Chat" chatId={data?.stream?.chat?.id} />
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log('BUILDING STREAM DETAIL. STATICALLY');
  const id = ctx?.params?.id;
  if (!Number(id)) {
    return {
      notFound: true
    };
  }
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      chat: {
        select: {
          id: true
        }
      }
    }
  });
  if (!stream) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stream: JSON.parse(JSON.stringify(stream))
    }
  };
};

export default LiveStream;
