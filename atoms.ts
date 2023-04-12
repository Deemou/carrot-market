import { atom } from 'recoil';

const width = typeof window !== 'undefined' ? window.innerWidth : null;
const mobile =
  typeof navigator !== 'undefined'
    ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    : false;

export const windowWidth = atom({
  key: 'windowWidth',
  default: width
});

export const isMobile = atom({
  key: 'isMobile',
  default: mobile
});
