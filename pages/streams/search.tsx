import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Stream } from '@prisma/client';
import Layout from '@/components/layout';
import PaginationBar from '@/components/pagination-bar';
import SearchBar from '@/components/search-bar';

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
  lastPage: number;
}

const StreamSearch: NextPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [page, setPage] = useState<number>(1);
  const { data } = useSWR<StreamsResponse>(
    q ? `/api/streams/search?q=${q}&page=${page}` : null
  );

  useEffect(() => {
    if (router?.query?.page) {
      setPage(+router.query.page);
    }
  }, [page, router]);

  return (
    <Layout seoTitle="StreamSearch">
      <SearchBar section="streams" />
      <h3 className="mb-4 mt-28">Results for : {q}</h3>
      <div className="flex flex-col space-y-5 divide-y-[1px]">
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
        {!data?.ok && (
          <div className="mt-10">
            <h3 className="text-center">No results found</h3>
          </div>
        )}
        {data?.ok && (
          <PaginationBar currentPage={page} lastPage={data.lastPage} />
        )}
      </div>
    </Layout>
  );
};

export default StreamSearch;
