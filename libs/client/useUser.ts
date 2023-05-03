/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { User } from '@prisma/client';
import useSWR from 'swr';

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

const reqestUrl = '/api/users/me';

export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>(reqestUrl);

  return { user: data?.profile, isLoading: !data && !error };
}
