import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useRestClientForm } from '../../hooks/useRestClientForm';
import * as sendRequestModule from '../../utils/sendRequest';
import * as validateModule from '../../utils/validate';
import * as buildModule from '../../utils/buildHeadersAndData';
import * as replaceUrlModule from '../../utils/replaceUrl';

describe('useRestClientForm', () => {
  const url = '/api/test';
  const method = 'POST';
  const body = '{"key":"value"}';
  const headersList = [{ key: 'Authorization', value: 'Bearer {{token}}' }];
  const variables = [{ varName: 'token', varValue: '123' }];

  beforeEach(() => {
    vi.restoreAllMocks();
  });
  const formElement = document.createElement('form');
  const urlInput = document.createElement('input');
  urlInput.name = 'url';
  urlInput.value = url;
  formElement.appendChild(urlInput);

  const methodInput = document.createElement('input');
  methodInput.name = 'method';
  methodInput.value = method;
  formElement.appendChild(methodInput);

  const formEvent = {
    preventDefault: vi.fn(),
    currentTarget: formElement,
  } as unknown as React.FormEvent<HTMLFormElement>;
  it('should validate form and send request successfully', async () => {
    const mockValidate = vi.spyOn(validateModule, 'Validate').mockResolvedValue(true);
    const mockSend = vi.spyOn(sendRequestModule, 'sendRequest').mockResolvedValue({
      status: 200,
      data: { status: 200, data: 'ok' },
    });
    const mockBuildHeaders = vi
      .spyOn(buildModule, 'buildHeaders')
      .mockReturnValue({ Authorization: 'Bearer 123' });
    const mockBuildRequestData = vi.spyOn(buildModule, 'buildRequestData').mockReturnValue({
      url,
      body,
      method,
    });
    const mockReplaceUrl = vi.spyOn(replaceUrlModule, 'replaseURL').mockImplementation(vi.fn());

    const { result } = renderHook(() =>
      useRestClientForm({ url, method, body, headersList, variables }),
    );

    await act(async () => {
      await result.current.handleSubmit(formEvent);
    });

    expect(mockValidate).toHaveBeenCalled();
    expect(mockBuildHeaders).toHaveBeenCalledWith(headersList, variables);
    expect(mockBuildRequestData).toHaveBeenCalledWith(url, body, method, variables);
    expect(mockReplaceUrl).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalledWith({
      method,
      url,
      headers: { Authorization: 'Bearer 123' },
      body,
    });
    expect(result.current.res).toBe('ok');
    expect(result.current.status).toBe(200);
    expect(result.current.fetchError).toBe('');
    expect(result.current.errors).toEqual({});
  });

  it('should not send request if validation fails', async () => {
    const mockValidate = vi.spyOn(validateModule, 'Validate').mockResolvedValue(false);
    const mockSend = vi.spyOn(sendRequestModule, 'sendRequest');
    const { result } = renderHook(() =>
      useRestClientForm({ url, method, body, headersList, variables }),
    );

    await act(async () => {
      await result.current.handleSubmit(formEvent);
    });

    expect(mockValidate).toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('should handle server error 500', async () => {
    vi.spyOn(validateModule, 'Validate').mockResolvedValue(true);
    vi.spyOn(sendRequestModule, 'sendRequest').mockResolvedValue({
      status: 500,
      data: { error: 'Server error' },
    });
    const { result } = renderHook(() =>
      useRestClientForm({ url, method, body, headersList, variables }),
    );

    await act(async () => {
      await result.current.handleSubmit(formEvent);
    });

    expect(result.current.res).toBe('');
    expect(result.current.status).toBe(0);
    expect(result.current.fetchError).toBe('Server error');
  });
});
