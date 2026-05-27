import { useQuery } from '@tanstack/react-query';
import { getPublicSettings } from '@/api/settings';

export function usePublicSettings() {
  return useQuery({
    queryKey: ['publicSettings'],
    queryFn: getPublicSettings,
    staleTime: 60_000,
  });
}
