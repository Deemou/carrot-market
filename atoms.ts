import { atom, selector } from 'recoil';

export const windowWidthAtom = atom({
  key: 'windowWidth',
  default: typeof window !== 'undefined' ? window.innerWidth : 0
});

export const isMobileAtom = atom({
  key: 'isMobile',
  default:
    typeof navigator !== 'undefined'
      ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      : false
});

export const slideContentCols = selector({
  key: 'slideContentCols',
  get: ({ get }) => {
    const width = get(windowWidthAtom);
    if (width >= 800) {
      return 5;
    }
    if (width >= 600) {
      return 4;
    }
    if (width >= 400) {
      return 3;
    }
    return 2;
  }
});
