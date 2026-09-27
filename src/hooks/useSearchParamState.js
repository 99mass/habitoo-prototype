'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Hook de compatibilité offrant [searchParams, setSearchParams] identique à react-router-dom
 * mais motorisé par le Next.js App Router (useSearchParams, useRouter, usePathname).
 */
export function useSearchParamState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSearchParams = useCallback(
    (updater, options = { replace: true, scroll: false }) => {
      let nextParams;
      if (typeof updater === 'function') {
        const current = new URLSearchParams(searchParams ? searchParams.toString() : '');
        const result = updater(current);
        nextParams = result instanceof URLSearchParams ? result : new URLSearchParams(result || {});
      } else if (updater instanceof URLSearchParams) {
        nextParams = updater;
      } else if (updater && typeof updater === 'object') {
        nextParams = new URLSearchParams(updater);
      } else {
        nextParams = new URLSearchParams();
      }

      const queryString = nextParams.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (options?.replace === false) {
        router.push(targetUrl, { scroll: options.scroll ?? false });
      } else {
        router.replace(targetUrl, { scroll: options.scroll ?? false });
      }
    },
    [router, pathname, searchParams]
  );

  return [searchParams, setSearchParams];
}

export default useSearchParamState;
