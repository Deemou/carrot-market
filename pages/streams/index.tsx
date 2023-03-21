import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Stream } from '@prisma/client';
import useSWR from 'swr';
import Layout from '@/components/layout';
import FloatingButton from '@components/floating-button';
import PaginationBar from '@components/pagination-bar';

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
  lastPage: number;
}

const Streams: NextPage = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);

  const { data } = useSWR<StreamsResponse>(`/api/streams?page=${page}`);
  useEffect(() => {
    if (router?.query?.page) {
      setPage(+router.query.page);
    }
  }, [page, router]);
  return (
    <Layout seoTitle="Streams">
      <div className=" space-y-4 divide-y-[1px]">
        {data?.streams.map((stream) => (
          <Link
            key={stream.id}
            href={`/streams/${stream.id}`}
            className="block px-4  pt-4"
          >
            <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
            <h1 className="white mt-2 text-2xl font-bold">{stream.name}</h1>
          </Link>
        ))}
        {data && <PaginationBar currentPage={page} lastPage={data.lastPage} />}
        <FloatingButton href="/streams/create">
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;
