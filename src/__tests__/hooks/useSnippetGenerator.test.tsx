import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSnippetGenerator } from '../../hooks/useSnippetGenerator';
import { VariableItem } from '../../type/type';

vi.mock('postman-collection', () => ({
  Request: vi.fn().mockImplementation((props) => props),
}));

vi.mock('postman-code-generators', () => ({
  convert: vi.fn(),
}));

describe('useSnippetGenerator', () => {
  const variables: VariableItem[] = [
    { varName: 'token', varValue: '123' },
    { varName: 'user', varValue: 'timofey' },
  ];

  it('should generate snippet with substituted variables', async () => {
    const { result } = renderHook(() =>
      useSnippetGenerator({
        method: 'GET',
        url: 'http://example.com',
        headersList: [
          { key: 'Authorization', value: 'Bearer {{token}}' },
          { key: 'user', value: '{{user}}}' },
        ],
        body: '',
        lang: { language: 'javascript', variant: 'fetch' },
        variables,
      }),
    );

    await waitFor(() => {
      expect(result.current).toContain('Bearer 123');
      expect(result.current).toContain('timofey');
    });
  });

 
});
