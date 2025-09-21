import { headersList, VariableItem } from '../type/type';
import { substitute, substituteHeaders } from './substitute';

export function buildHeaders(headers: headersList, variables: VariableItem[]) {
  const substituteHeader = substituteHeaders(headers, variables);
  return Object.fromEntries(substituteHeader.map((h) => [h.key, h.value]));
}

export function buildRequestData(
  url: string,
  body: string,
  method: string,
  variables: VariableItem[],
) {
  return {
    url: substitute(url, variables),
    body: substitute(body, variables),
    method,
  };
}
