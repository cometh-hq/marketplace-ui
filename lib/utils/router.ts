import { usePathname as useNextPathname } from 'next/navigation'

/**
 * Retrieves the current url pathname, **from the base path**.
 * Note: This is used as a workaround because the current implementation of `usePathname` from NextJS is inconsistent
 * in scenarios where the application is running with a "basePath" that is not the root. In this scenario, on the
 * server side `usePathname` would return the path after the base path but on the client side, it would result in the
 * path including the base path. This in turn could cause the application to rehydrate improperly and trigger errors
 * when the page hydrates in the browser. See: https://github.com/vercel/next.js/issues/46562
 */
export function usePathname(): string {
  let pathname = useNextPathname();
  if (pathname && process?.env?.NEXT_PUBLIC_BASE_PATH && pathname.startsWith(process.env.NEXT_PUBLIC_BASE_PATH)) {
    pathname = pathname.substring(process.env.NEXT_PUBLIC_BASE_PATH.length)
    return pathname === '' ? '/' : pathname
  }
  return pathname;
}