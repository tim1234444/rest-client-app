import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryContainer from '@/src/components/containers/HistoryContainer';
import { ITableProps } from '@/src/components/Row/Row';
import { PostgrestError } from '@supabase/supabase-js';

vi.mock('next/dynamic', () => {
  return {
    default:
      () =>
      ({
        history_and_analytics,
        error,
      }: {
        history_and_analytics: ITableProps[];
        error: PostgrestError;
      }) => (
        <div data-testid="table-history">
          <span data-testid="rows">{history_and_analytics?.length ?? 0}</span>
          <span data-testid="error">{error ? error.message : 'no-error'}</span>
        </div>
      ),
  };
});

describe('HistoryContainer', () => {
  it('renders TableHistory with data', async () => {
    const history_and_analytics: ITableProps[] = [
      {
        id: 1,
        request_duration: 120,
        response_status_code: 200,
        request_timestamp: '2025-09-20T10:00:00Z',
        request_method: 'GET',
        request_size: 256,
        response_size: 512,
        error_details: '',
        endpoint_url: '/api/test1',
        request_headers: '{"Content-Type":"application/json"}',
        request_body: '{}',
      },
      {
        id: 2,
        request_duration: 300,
        response_status_code: 404,
        request_timestamp: '2025-09-20T11:00:00Z',
        request_method: 'POST',
        request_size: 128,
        response_size: 1024,
        error_details: 'Not Found',
        endpoint_url: '/api/test2',
        request_headers: '{"Content-Type":"application/json"}',
        request_body: '{"test":1}',
      },
    ];

    render(<HistoryContainer history_and_analytics={history_and_analytics} error={null} />);

    expect(await screen.findByTestId('table-history')).toBeInTheDocument();
    expect((await screen.findByTestId('rows')).textContent).toBe('2');
    expect((await screen.findByTestId('error')).textContent).toBe('no-error');
  });

  it('renders error message if error is provided', async () => {
    const error: PostgrestError = {
      message: 'Some error',
      details: '',
      hint: '',
      code: '400',
      name: 'PostgrestError',
    };

    render(<HistoryContainer history_and_analytics={null} error={error} />);

    expect((await screen.findByTestId('error')).textContent).toBe('Some error');
  });

  it('renders empty state if history_and_analytics is null', async () => {
    render(<HistoryContainer history_and_analytics={null} error={null} />);
    expect((await screen.findByTestId('rows')).textContent).toBe('0');
  });
});
