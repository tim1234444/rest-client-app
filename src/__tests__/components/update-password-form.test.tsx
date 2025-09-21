import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UpdatePasswordForm } from '@/src/components/update-password-form';
const pushMock = vi.fn();
const updateUserMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/src/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      updateUser: updateUserMock,
    },
  }),
}));
describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    beforeEach(() => {
      pushMock.mockReset();
      updateUserMock.mockReset();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    pushMock.mockReset();
    updateUserMock.mockReset();
  });

  it('renders form correctly', () => {
    render(<UpdatePasswordForm />);
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save new password/i })).toBeInTheDocument();
  });

  it('calls supabase updateUser and redirects on success', async () => {
    updateUserMock.mockResolvedValue({ error: null });
    render(<UpdatePasswordForm />);

    const input = screen.getByLabelText(/new password/i);
    const button = screen.getByRole('button', { name: /save new password/i });

    fireEvent.change(input, { target: { value: 'newPassword123' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith({ password: 'newPassword123' });
      expect(pushMock).toHaveBeenCalledWith('/protected');
    });
  });

  it('displays error message if updateUser fails', async () => {
    updateUserMock.mockResolvedValue({ error: new Error('Update failed') });
    render(<UpdatePasswordForm />);

    const input = screen.getByLabelText(/new password/i);
    const button = screen.getByRole('button', { name: /save new password/i });

    fireEvent.change(input, { target: { value: 'newPassword123' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });

  it('disables button while loading', async () => {
    updateUserMock.mockImplementation(() => new Promise(() => {}));
    render(<UpdatePasswordForm />);

    const input = screen.getByLabelText(/new password/i);
    const button = screen.getByRole('button', { name: /save new password/i });

    fireEvent.change(input, { target: { value: 'newPassword123' } });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/saving/i);
  });
});
