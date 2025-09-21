import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VariablesForm from '@/src/components/VariablesForm/VariablesForm';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('VariablesForm', () => {
  it('renders empty state if no variables in localStorage', () => {
    render(<VariablesForm id="test-id" />);
    expect(screen.getByText('notfound')).toBeInTheDocument();
  });

  it('loads variables from localStorage on mount', () => {
    const stored = [{ varName: 'VAR1', varValue: 'VALUE1' }];
    localStorage.setItem('test-id', JSON.stringify(stored));
    render(<VariablesForm id="test-id" />);

    expect(screen.getByText('VAR1')).toBeInTheDocument();
    expect(screen.getByText('VALUE1')).toBeInTheDocument();
  });

  it('adds a new variable on submit', async () => {
    const user = userEvent.setup();
    render(<VariablesForm id="test-id" />);

    const valueInput = screen.getByPlaceholderText('val2');
    const nameInput = screen.getByPlaceholderText('val1');
    const saveButton = screen.getByText('save');

    await user.type(nameInput, 'NEW_VAR');
    await user.type(valueInput, '123');
    await user.click(saveButton);

    expect(screen.getByText('NEW_VAR')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem('test-id') || '[]');
    expect(stored).toEqual([{ varName: 'NEW_VAR', varValue: '123' }]);
  });

  it('deletes a variable', async () => {
    const user = userEvent.setup();
    const stored = [{ varName: 'TO_DELETE', varValue: 'XYZ' }];
    localStorage.setItem('test-id', JSON.stringify(stored));

    render(<VariablesForm id="test-id" />);

    const deleteButton = screen.getByText('delete');
    await user.click(deleteButton);

    expect(screen.queryByText('TO_DELETE')).not.toBeInTheDocument();
    expect(screen.queryByText('XYZ')).not.toBeInTheDocument();

    const storedAfter = JSON.parse(localStorage.getItem('test-id') || '[]');
    expect(storedAfter).toEqual([]);
  });

  it('updates existing variable if name matches', async () => {
    const user = userEvent.setup();
    const stored = [{ varName: 'EXISTING', varValue: 'OLD' }];
    localStorage.setItem('test-id', JSON.stringify(stored));

    render(<VariablesForm id="test-id" />);

    const valueInput = screen.getByPlaceholderText('val2');
    const nameInput = screen.getByPlaceholderText('val1');
    const saveButton = screen.getByText('save');

    await user.type(nameInput, 'EXISTING');
    await user.type(valueInput, 'NEW');
    await user.click(saveButton);

    expect(screen.getByText('EXISTING')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();

    const storedAfter = JSON.parse(localStorage.getItem('test-id') || '[]');
    expect(storedAfter).toEqual([{ varName: 'EXISTING', varValue: 'NEW' }]);
  });
});
