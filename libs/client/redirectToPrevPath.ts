import { HOME_URL } from '@/routes';
import { NextRouter } from 'next/router';

const redirectToPrevPath = (router: NextRouter) => {
  const prevPath = localStorage.getItem('prevPath') || HOME_URL;
  router.replace(prevPath);
};

export default redirectToPrevPath;
