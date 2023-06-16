import { useEffect, useState } from 'react';

type Direction = 'up' | 'down';

export default function useInfiniteScroll(
  direction?: Direction,
  scrollId?: string
) {
  const [page, setPage] = useState(1);

  function handleWindowScroll() {
    if (
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight - 100
    ) {
      setPage((p) => p + 1);
    }
  }

  useEffect(() => {
    if (!scrollId) {
      window.addEventListener('scroll', handleWindowScroll);
      return () => {
        window.removeEventListener('scroll', handleWindowScroll);
      };
    }

    const scrollBox = document.getElementById(scrollId);
    if (!scrollBox) return;

    function handleScroll() {
      if (!scrollBox) return;
      if (direction === 'up') {
        if (scrollBox?.scrollTop === 0) {
          setPage((p) => p + 1);
        }
      } else if (
        scrollBox.scrollTop + scrollBox.offsetHeight ===
        scrollBox.scrollHeight
      ) {
        setPage((p) => p + 1);
      }
    }
    scrollBox.addEventListener('scroll', handleScroll);
    return () => {
      scrollBox.removeEventListener('scroll', handleScroll);
    };
  });
  return page;
}
