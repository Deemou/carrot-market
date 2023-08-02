import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cls from '@/libs/client/utils';
import PrevIcon from './icon/prev-icon';
import NextIcon from './icon/next-icon';
import ThreeDotIcon from './icon/three-dot-icon';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
}
type Direction = 'prev' | 'next';

export default function PaginationBar({
  currentPage,
  lastPage
}: PaginationProps) {
  const router = useRouter();
  const { q } = router.query;
  const [pages, setPages] = useState<number[]>([]);
  const pageLimit = Math.min(5, lastPage);
  const onClickPage = (page: number) => {
    if (q) router.push(`${router.pathname}?q=${q}&page=${page}`);
    else router.push(`${router.pathname}?page=${page}`);
  };
  const onClickDirection = (direction: Direction) => {
    if (direction === 'prev') {
      if (q) router.push(`${router.pathname}?q=${q}&page=${currentPage - 1}`);
      else router.push(`${router.pathname}?page=${currentPage - 1}`);
    } else if (q)
      router.push(`${router.pathname}?q=${q}&page=${currentPage + 1}`);
    else router.push(`${router.pathname}?page=${currentPage + 1}`);
  };
  useEffect(() => {
    if (currentPage <= 3) {
      setPages(Array.from({ length: pageLimit }, (_, i) => i + 1));
    } else if (currentPage > 3 && currentPage + 2 < lastPage) {
      setPages([
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2
      ]);
    } else if (currentPage + 3 >= lastPage) {
      setPages(
        Array.from({ length: pageLimit }, (_, i) => lastPage - i).reverse()
      );
    }
  }, [currentPage, lastPage, pageLimit]);
  return (
    <div className="mt-10 flex items-center justify-center space-x-2 py-5">
      <button
        onClick={() => {
          onClickDirection('prev');
        }}
        type="button"
        className={currentPage === 1 ? 'hidden' : 'block'}
      >
        <PrevIcon />
      </button>
      <div
        className={cls(
          'flex items-center justify-center',
          pages.includes(1) ? 'hidden' : ''
        )}
      >
        <button
          onClick={() => {
            onClickPage(1);
          }}
          type="button"
          className="aspect-square h-10 rounded-md bg-red-500"
        >
          <span>{1}</span>
        </button>
        <div className="ml-3 mr-1 aspect-square h-4">
          <ThreeDotIcon />
        </div>
      </div>
      {pages?.map((page) => {
        return (
          <button
            onClick={() => {
              onClickPage(page);
            }}
            key={page}
            type="button"
            className={cls(
              'aspect-square h-10 rounded-md',
              page === currentPage
                ? 'border border-white bg-black'
                : 'bg-red-500'
            )}
            disabled={page === currentPage}
          >
            <span>{page}</span>
          </button>
        );
      })}
      <div
        className={cls(
          'flex items-center justify-center',
          pages.includes(lastPage) ? 'hidden' : ''
        )}
      >
        <div className="ml-1 mr-3 aspect-square h-4">
          <ThreeDotIcon />
        </div>
        <button
          onClick={() => {
            onClickPage(lastPage);
          }}
          type="button"
          className="aspect-square h-10 rounded-md bg-red-500"
        >
          <span>{lastPage}</span>
        </button>
      </div>
      <button
        onClick={() => {
          onClickDirection('next');
        }}
        type="button"
        className={currentPage === lastPage ? 'hidden' : 'block'}
      >
        <NextIcon />
      </button>
    </div>
  );
}
