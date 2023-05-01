/* eslint-disable react/button-has-type */
/* eslint-disable no-void */
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
  const [pages, setPages] = useState<number[]>([]);
  const pageLimit = Math.min(5, lastPage);
  const onClickPage = (page: number) => {
    void router.push(`${router.pathname}?page=${page}`);
  };
  const onClickDirection = (direction: Direction) => {
    if (direction === 'prev') {
      void router.push(`${router.pathname}?page=${currentPage - 1}`);
    } else {
      void router.push(`${router.pathname}?page=${currentPage + 1}`);
    }
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
        className={currentPage === 1 ? 'hidden' : 'block'}
        onClick={() => {
          onClickDirection('prev');
        }}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
          className="aspect-square h-10 rounded-md bg-red-500 font-medium "
          onClick={() => {
            onClickPage(1);
          }}
        >
          <span>{1}</span>
        </button>
        <svg
          className="ml-3 mr-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
            className={cls(
              'aspect-square h-10 rounded-md font-medium ',
              page === currentPage
                ? 'border border-white bg-black'
                : 'bg-red-500'
            )}
            onClick={() => {
              onClickPage(page);
            }}
            key={page}
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
          className="ml-1 mr-3 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
        <button
          className="aspect-square h-10 rounded-md bg-red-500 font-medium "
          onClick={() => {
            onClickPage(lastPage);
          }}
        >
          <span>{lastPage}</span>
        </button>
      </div>
      <button
        className={currentPage === lastPage ? 'hidden' : 'block'}
        onClick={() => {
          onClickDirection('next');
        }}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
