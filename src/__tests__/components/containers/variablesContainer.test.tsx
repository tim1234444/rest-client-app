import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import VariablesContainer from '@/src/components/containers/VariablesContainer';

vi.mock('next/dynamic', () => {
  return {
    default:
      () =>
      ({ id }: { id: string }) =>
        <div data-testid="variables-form">mocked-variables-form-{id}</div>,
  };
});

describe('VariablesContainer', () => {
  it('renders VariablesForm with id', async () => {
    render(<VariablesContainer id="123" />);
    expect(await screen.findByTestId('variables-form')).toHaveTextContent(
      'mocked-variables-form-123'
    );
  });

  it('renders VariablesForm with another id', async () => {
    render(<VariablesContainer id="abc" />);
    expect(await screen.findByTestId('variables-form')).toHaveTextContent(
      'mocked-variables-form-abc'
    );
  });
});
