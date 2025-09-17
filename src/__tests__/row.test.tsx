import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, vi, describe } from 'vitest';
import '@testing-library/jest-dom';
import Row from '@/src/components/Row/Row';

const mockTableProps  = {
  request_duration: 122,
  response_status_code: 122,
  request_timestamp: 'string',
  request_method: 'string',
  request_size: 122,
  response_size: 122,
  error_details: 'string',
  endpoint_url: 'string',
  id: 122,
  request_headers: 'string',
  request_body: 'string'
}

vi.mock('@/src/components/RowButton/RowButton', () => ({
  default: function MockRowButton() {
    return (
      <button data-testid="row-button">
        Restore
      </button>
    );
  }
}));

describe('Row component', () => {
  test('Row render', () => {
    render(<Row uuidKey={'1'} value={mockTableProps} id={1} />);
    const rowElement = screen.getByRole('row');
    expect(rowElement).toBeInTheDocument();
  });
})
