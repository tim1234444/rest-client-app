import { ReplaceURLParams } from '../type/type';

export const replaseURL = function ({
  method = '',
  url = '',
  headers = '',
  body = '',
}: ReplaceURLParams) {
  window.history.replaceState(null, '', `/protected/client/${method}` + url + body + headers);
};
