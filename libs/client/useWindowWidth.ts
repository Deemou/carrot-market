import { windowWidthAtom } from '@/atoms';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

export default function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useRecoilState(windowWidthAtom);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWindowWidth]);

  return windowWidth;
}
