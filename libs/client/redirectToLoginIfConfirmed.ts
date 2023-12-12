import { LOGIN_URL } from '@/routes';
import { NextRouter } from 'next/router';

const redirectToLoginIfConfirmed = (router: NextRouter) => {
  const result = confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?');
  if (result && router) router.push(LOGIN_URL);
};

export default redirectToLoginIfConfirmed;
