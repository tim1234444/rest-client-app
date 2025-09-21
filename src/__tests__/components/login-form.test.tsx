import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/src/components/login-form';

interface SignInResponse {
  data?: unknown;
  error: Error | null;
}

const signInMock = vi.fn();
vi.mock('@/src/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: signInMock,
    },
  }),
}));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'login' })).toBeInTheDocument();
  });

  it('submits form successfully and navigates', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password'), '123456');

    let resolvePromise: ((value: SignInResponse) => void) | null = null;
    signInMock.mockImplementation(
      () =>
        new Promise<SignInResponse>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'login' }));

    expect(signInMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });

    await act(async () => {
      resolvePromise?.({ error: null });
    });

    expect(pushMock).toHaveBeenCalledWith('/protected');
  });

  it('shows error when supabase returns error', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password'), '123456');

    let resolvePromise: ((value: SignInResponse) => void) | null = null;
    signInMock.mockImplementation(
      () =>
        new Promise<SignInResponse>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'login' }));

    await act(async () => {
      resolvePromise?.({ error: new Error('Supabase error') });
    });

    expect(await screen.findByText('Supabase error')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
