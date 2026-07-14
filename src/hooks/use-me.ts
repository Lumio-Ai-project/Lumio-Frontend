import { useQuery } from '@tanstack/react-query';

import { authKeys } from '@/api/auth/keys';
import { fetchMe } from '@/api/auth/queries';
import { getAccessToken } from '@/lib/auth-storage';

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchMe,
    enabled: Boolean(getAccessToken()),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
