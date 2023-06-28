import { atom } from 'recoil';

const mobile =
  typeof navigator !== 'undefined'
    ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    : false;

export default atom({
  key: 'isMobile',
  default: mobile
});
