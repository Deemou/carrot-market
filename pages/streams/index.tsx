import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Stream } from '@prisma/client';
import useSWR from 'swr';
import Layout from '@/components/layout';
import PaginationBar from '@components/pagination-bar';
import SearchBar from '@/components/search-bar';

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
      <SearchBar section="streams" />
      <div className="mt-24 space-y-5 divide-y-[1px]">
        {data?.streams.map((stream) => (
          <Link
            href={`/streams/${stream.id}`}
            key={stream.id}
            className="block pt-4"
          >
            <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
            <h2 className="mt-2">{stream.name}</h2>
          </Link>
        ))}
        {data && <PaginationBar currentPage={page} lastPage={data.lastPage} />}
      </div>
    </Layout>
  );
};

export default Streams;
