import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForgotPasswordForm } from '@/src/components/forgot-password-form';

interface ResetPasswordResponse {
  error: Error | null;
}

const resetPasswordMock = vi.fn();
vi.mock('@/src/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      resetPasswordForEmail: resetPasswordMock,
    },
  }),
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send reset email' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  it('submits form successfully and shows success message', async () => {
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');

    let resolvePromise: ((value: ResetPasswordResponse) => void) | null = null;
    resetPasswordMock.mockImplementation(
      () =>
        new Promise<ResetPasswordResponse>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Send reset email' }));

    expect(resetPasswordMock).toHaveBeenCalledWith('test@example.com', {
      redirectTo: expect.stringContaining('/auth/update-password'),
    });

    await act(async () => {
      resolvePromise?.({ error: null });
    });

    expect(await screen.findByText('Check Your Email')).toBeInTheDocument();
    expect(screen.getByText(/Password reset instructions sent/i)).toBeInTheDocument();
  });

  it('shows error when supabase returns error', async () => {
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');

    let resolvePromise: ((value: ResetPasswordResponse) => void) | null = null;
    resetPasswordMock.mockImplementation(
      () =>
        new Promise<ResetPasswordResponse>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Send reset email' }));

    await act(async () => {
      resolvePromise?.({ error: new Error('Supabase error') });
    });

    expect(await screen.findByText('Supabase error')).toBeInTheDocument();
  });
});
