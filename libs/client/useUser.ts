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

export default function useUser() {
  const router = useRouter();
  const reqestUrl = '/api/users/me';
  const loginUrl = '/enter';
  const profileUrl = '/profile';
  const { data, error } = useSWR<ProfileResponse>(reqestUrl);
  useEffect(() => {
    if (data && !data.ok) {
      void router.replace(loginUrl);
    }
    if (data && data.ok && router.pathname === loginUrl) {
      void router.replace(profileUrl);
    }
  }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
}
