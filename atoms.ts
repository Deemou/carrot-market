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
