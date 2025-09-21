import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReplaceURLParams } from '../../type/type';
import { replaseURL } from '../../utils/replaceUrl';

describe('replaseURL', () => {
  const originalReplaceState = window.history.replaceState;

  beforeEach(() => {
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    window.history.replaceState = originalReplaceState;
  });

  it('should call replaceState with correct URL when all parameters are provided', () => {
    const params: ReplaceURLParams = {
      method: 'GET',
      url: '/api/test',
      headers: '?h=1',
      body: '&b=2',
    };

    replaseURL(params);

    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/protected/client/GET/api/test&b=2?h=1',
    );
  });

  it('should work correctly with empty parameters', () => {
    const params: ReplaceURLParams = {};

    replaseURL(params);

    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/protected/client/');
  });

  it('should insert only method and url if headers and body are empty', () => {
    const params: ReplaceURLParams = {
      method: 'POST',
      url: '/endpoint',
    };

    replaseURL(params);

    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/protected/client/POST/endpoint',
    );
  });
});
