import { headersList } from '../type/type';

export function parseUrlParams(
  paramsArray: string[] | undefined,
  searchParams: URLSearchParams,
): [string, string, string, headersList] {
  const arr = paramsArray ?? [];

  const method = arr[0] ?? 'GET';
  const url = arr[1] ? atob(decodeURIComponent(arr[1])) : '';
  const body = arr[2] ? atob(decodeURIComponent(arr[2])) : '';
  const headers: headersList = Array.from(searchParams.entries()).map(([key, value]) => ({
    key,
    value,
  }));

  return [method, url, body, headers];
}
