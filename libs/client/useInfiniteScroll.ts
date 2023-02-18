/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';

type Direction = 'up' | 'down';
export default function useInfiniteScroll(
  direction: Direction,
  scrollId: string
) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const scrollBox = document.getElementById(scrollId);
    function handleScroll() {
      if (!scrollBox) return;
      if (direction === 'down') {
        if (
          scrollBox.scrollTop + scrollBox.offsetHeight ===
          scrollBox.scrollHeight
        ) {
          setPage((p) => p + 1);
        }
      } else if (direction === 'up') {
        if (scrollBox?.scrollTop === 0) {
          setPage((p) => p + 1);
        }
      }
    }
    if (!scrollBox) return;
    scrollBox.addEventListener('scroll', handleScroll);
    return () => {
      scrollBox.removeEventListener('scroll', handleScroll);
    };
  });
  return page;
}
