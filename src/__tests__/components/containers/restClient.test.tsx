import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RestClientContainer from '@/src/components/containers/RestClientContainer';

vi.mock('next/dynamic', () => {
  return {
    default:
      () =>
      ({ id }: { id: string }) =>
        <div data-testid="rest-form">mocked-rest-form-{id}</div>,
  };
});

describe('RestClientContainer', () => {
  it('renders RestForm with id', async () => {
    render(<RestClientContainer id="123" />);
    expect(await screen.findByTestId('rest-form')).toHaveTextContent(
      'mocked-rest-form-123'
    );
  });

  it('renders RestForm with another id', async () => {
    render(<RestClientContainer id="abc" />);
    expect(await screen.findByTestId('rest-form')).toHaveTextContent(
      'mocked-rest-form-abc'
    );
  });
});
