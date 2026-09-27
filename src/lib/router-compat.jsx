'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useSearchParams as useNextSearchParams, useParams as useNextParams } from 'next/navigation';
import { useSearchParamState } from '../hooks/useSearchParamState';

/**
 * Composant Link universel supportant href ou to, propulsé par Next.js
 */
export const Link = React.forwardRef(({ to, href, children, ...props }, ref) => {
  const target = href || to || '#';
  return (
    <NextLink ref={ref} href={target} {...props}>
      {children}
    </NextLink>
  );
});
Link.displayName = 'Link';

/**
 * Hook useNavigate émulé sur base de Next.js useRouter
 */
export function useNavigate() {
  const router = useRouter();
  return React.useCallback(
    (to, options) => {
      if (typeof to === 'number') {
        if (to < 0) {
          router.back();
        } else if (to > 0) {
          router.forward();
        }
        return;
      }
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router]
  );
}

/**
 * Hook useLocation émulé sur base de Next.js usePathname et useSearchParams
 */
export function useLocation() {
  const pathname = usePathname() || '/';
  const searchParams = useNextSearchParams();
  const search = searchParams ? (searchParams.toString() ? `?${searchParams.toString()}` : '') : '';
  return {
    pathname,
    search,
    hash: '',
    state: null,
    key: 'default',
  };
}

/**
 * Hook useParams universel
 */
export function useParams() {
  const params = useNextParams();
  return params || {};
}

/**
 * Hook useSearchParams réactif universel
 */
export function useSearchParams() {
  return useSearchParamState();
}

export default Link;
