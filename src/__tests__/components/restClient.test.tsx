import RestClient from '@/src/components/RestForm/RestForm'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, vi } from 'vitest'
import React from 'react'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({ params: [] }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/src/hooks/useSnippetGenerator', () => ({
  useSnippetGenerator: () => 'snippet-code',
}))

vi.mock('@/src/hooks/useRestClientForm', () => ({
  useRestClientForm: () => ({
    handleSubmit: vi.fn(),
    isLoading: false,
    res: null as null | unknown,
    status: null as null | number,
    fetchError: null as null | Error,
    errors: {} as Record<string, string>,
  }),
}))

vi.mock('@monaco-editor/react', () => ({
  Editor: (props: React.ComponentProps<'textarea'>) => (
    <textarea data-testid="editor" {...props} />
  ),
}))

describe('RestClient', () => {
  it('renders form fields', () => {
    render(<RestClient id="123" />)
    expect(screen.getByLabelText('method')).toBeInTheDocument()
    expect(screen.getByLabelText('url')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('value')).toBeInTheDocument()
    expect(screen.getAllByTestId('editor').length).toBeGreaterThan(0)
  })

  it('allows adding a header', async () => {
    render(<RestClient id="123" />)
    const nameInput = screen.getByPlaceholderText('name')
    const valueInput = screen.getByPlaceholderText('value')
    const addButton = screen.getByText('add')

    await userEvent.type(nameInput, 'Authorization')
    await userEvent.type(valueInput, 'Bearer token')
    await userEvent.click(addButton)

    expect(screen.getByText('Authorization')).toBeInTheDocument()
    expect(screen.getByText('Bearer token')).toBeInTheDocument()
  })
})
