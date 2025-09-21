import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from '@/src/components/sign-up-form';

type SignUpResult = { error: Error | null };

const signUpMock = vi.fn(); 

vi.mock('@/src/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { signUp: signUpMock },
  }),
}));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByLabelText('repeat')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'signup' })).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    render(<SignUpForm />);
    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password'), '123456');
    await userEvent.type(screen.getByLabelText('repeat'), '654321');

    await userEvent.click(screen.getByRole('button', { name: 'signup' }));

    const errorMessage = await screen.findByText((content, element) =>
      element?.tagName === 'P' && content.includes('Passwords do not match')
    );
    expect(errorMessage).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it('submits form successfully and navigates', async () => {
    render(<SignUpForm />);

    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password'), '123456');
    await userEvent.type(screen.getByLabelText('repeat'), '123456');

    let resolvePromise: ((value: SignUpResult) => void) | null = null;
    signUpMock.mockImplementation(
      () =>
        new Promise<SignUpResult>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'signup' }));

    expect(signUpMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
      options: { emailRedirectTo: expect.stringContaining('/protected') },
    });

    await act(async () => {
      resolvePromise?.({ error: null });
    });

    expect(pushMock).toHaveBeenCalledWith('/auth/sign-up-success');
  });

  it('shows error when supabase returns error', async () => {
    render(<SignUpForm />);

    await userEvent.type(screen.getByLabelText('email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password'), '123456');
    await userEvent.type(screen.getByLabelText('repeat'), '123456');

    let resolvePromise: ((value: SignUpResult) => void) | null = null;
    signUpMock.mockImplementation(
      () =>
        new Promise<SignUpResult>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    await userEvent.click(screen.getByRole('button', { name: 'signup' }));

    await act(async () => {
      resolvePromise?.({ error: new Error('Supabase error') });
    });

    expect(await screen.findByText('Supabase error')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
