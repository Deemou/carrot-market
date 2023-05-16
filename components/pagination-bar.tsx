import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cls from '@/libs/client/utils';

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
    if (q) void router.push(`${router.pathname}?q=${q}&page=${page}`);
    else void router.push(`${router.pathname}?page=${page}`);
  };
  const onClickDirection = (direction: Direction) => {
    if (direction === 'prev') {
      if (q)
        void router.push(`${router.pathname}?q=${q}&page=${currentPage - 1}`);
      else void router.push(`${router.pathname}?page=${currentPage - 1}`);
    } else if (q)
      void router.push(`${router.pathname}?q=${q}&page=${currentPage + 1}`);
    else void router.push(`${router.pathname}?page=${currentPage + 1}`);
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
    <div className="item-center flex justify-center space-x-2 py-5">
      <button
        onClick={() => {
          onClickDirection('prev');
        }}
        type="button"
        className={currentPage === 1 ? 'hidden' : 'block'}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
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
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-3 mr-1 h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
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
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1 mr-3 h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
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
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>
  );
}
