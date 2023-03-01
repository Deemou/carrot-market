/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

const reqestUrl = '/api/users/me';
const profileUrl = '/profile';
const loginUrl = '/login';
const signUpUrl = '/sign-up';

export default function useUser() {
  const router = useRouter();
  const { data, error } = useSWR<ProfileResponse>(reqestUrl);

  useEffect(() => {
    function isAuthPages() {
      return router.pathname === loginUrl || router.pathname === signUpUrl;
    }
    if (isAuthPages()) {
      if (data && data.ok) void router.replace(profileUrl);
      return;
    }
    if (data && !data.ok) {
      void router.replace(loginUrl);
    }
  }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
}
