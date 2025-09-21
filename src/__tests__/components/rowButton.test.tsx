import { render, screen, fireEvent } from '@testing-library/react';
import RowButton from '@/src/components/RowButton/RowButton';
import { vi } from 'vitest';

const mockPush = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockValue = {
  request_duration: 120,
  response_status_code: 200,
  request_timestamp: '2025-09-19T10:00:00Z',
  request_method: 'GET',
  request_size: 512,
  response_size: 1024,
  error_details: '',
  endpoint_url: '/api/test',
  id: 1,
  request_headers: '{}',
  request_body: '{}',
};

describe('RowButton', () => {
  it('renders button with translation key', () => {
    render(<RowButton value={mockValue} />);
    const button = screen.getByRole('button', { name: 'restore' });
    expect(button).toBeInTheDocument();
  });

  it('calls router.push with correct URL on click', () => {
    render(<RowButton value={mockValue} />);
    const button = screen.getByRole('button', { name: 'restore' });

    fireEvent.click(button);

    const expectedUrl =
      '/protected/client/' +
      mockValue.request_method +
      '/' +
      window.btoa(mockValue.endpoint_url) +
      '/' +
      window.btoa(mockValue.request_body) +
      '?' +
      mockValue.request_headers;

    expect(mockPush).toHaveBeenCalledWith(expectedUrl);
  });
});
