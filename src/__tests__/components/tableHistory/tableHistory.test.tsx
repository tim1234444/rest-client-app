import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ITableProps } from '@/src/components/Row/Row';
import { PostgrestError } from '@supabase/supabase-js';
import TableHistoryClient from './TableHistory';

vi.mock('@/src/components/Row/Row', () => {
  return {
    default: ({ value }: { value: ITableProps }) => (
      <tr data-testid={`row-${value.id}`}>
        <td>{value.request_method}</td>
        <td>{value.endpoint_url}</td>
      </tr>
    ),
  };
});

describe('TableHistoryClient', () => {
  it('renders error correctly', async () => {
    const error: PostgrestError = {
      message: 'Test error',
      details: '',
      hint: '',
      code: '400',
      name: 'PostgrestError',
    };

    render(<TableHistoryClient history_and_analytics={null} error={error} />);

    expect(await screen.findByTestId('error')).toHaveTextContent('Test error');
  });

  it('renders empty state correctly', async () => {
    render(<TableHistoryClient history_and_analytics={[]} error={null} />);
    expect(await screen.findByTestId('empty')).toHaveTextContent('notrequstmssage');
  });

  it('renders rows when data is provided', async () => {
    const history_and_analytics: ITableProps[] = [
      {
        id: 1,
        request_duration: 100,
        response_status_code: 200,
        request_timestamp: '2025-09-20T10:00:00Z',
        request_method: 'GET',
        request_size: 100,
        response_size: 200,
        error_details: '',
        endpoint_url: '/api/test1',
        request_headers: '{}',
        request_body: '{}',
      },
      {
        id: 2,
        request_duration: 150,
        response_status_code: 404,
        request_timestamp: '2025-09-20T11:00:00Z',
        request_method: 'POST',
        request_size: 150,
        response_size: 250,
        error_details: 'Not Found',
        endpoint_url: '/api/test2',
        request_headers: '{}',
        request_body: '{}',
      },
    ];

    render(<TableHistoryClient history_and_analytics={history_and_analytics} error={null} />);

    expect(await screen.findByTestId('row-1')).toHaveTextContent('GET');
    expect(await screen.findByTestId('row-1')).toHaveTextContent('/api/test1');
    expect(await screen.findByTestId('row-2')).toHaveTextContent('POST');
    expect(await screen.findByTestId('row-2')).toHaveTextContent('/api/test2');
  });
});
