import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PaginationArrowButton from './pagination-arrow-button';
import PageButton from './page-button';
import FirstPageButtonWithDots from './first-page-button-with-dots';
import LastPageButtonWithDots from './last-page-button-with-dots';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
}

export default function PaginationBar({
  currentPage,
  lastPage
}: PaginationProps) {
  const router = useRouter();
  const { q } = router.query;
  const [pages, setPages] = useState<number[]>([]);
  const pageLimit = Math.min(5, lastPage);

  const onClickPage = useCallback(
    (page: number) => {
      if (q) router.push(`${router.pathname}?q=${q}&page=${page}`);
      else router.push(`${router.pathname}?page=${page}`);
    },
    [q, router]
  );

  const onClickPrev = useCallback(() => {
    if (q) router.push(`${router.pathname}?q=${q}&page=${currentPage - 1}`);
    else router.push(`${router.pathname}?page=${currentPage - 1}`);
  }, [currentPage, q, router]);

  const onClickNext = useCallback(() => {
    if (q) router.push(`${router.pathname}?q=${q}&page=${currentPage + 1}`);
    else router.push(`${router.pathname}?page=${currentPage + 1}`);
  }, [currentPage, q, router]);

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
      {currentPage !== 1 && (
        <PaginationArrowButton
          direction="prev"
          onClickArrowButton={onClickPrev}
        />
      )}
      {!pages.includes(1) && (
        <FirstPageButtonWithDots onClick={() => onClickPage(1)} />
      )}
      {pages?.map((page) => (
        <PageButton
          key={page}
          page={page}
          isActive={page === currentPage}
          onClick={() => onClickPage(page)}
        />
      ))}
      {!pages.includes(lastPage) && (
        <LastPageButtonWithDots
          lastPage={lastPage}
          onClick={() => onClickPage(lastPage)}
        />
      )}

      {currentPage !== lastPage && (
        <PaginationArrowButton
          direction="next"
          onClickArrowButton={onClickNext}
        />
      )}
    </div>
  );
}
