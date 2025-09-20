import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from '../../components/ui/input'


describe('Input component', () => {
  it('renders correctly', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex') 
  })

  it('accepts text input', async () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement

    await userEvent.type(input, 'Hello World')
    expect(input.value).toBe('Hello World')
  })

  it('supports placeholder and type', () => {
    render(<Input data-testid="input" placeholder="Enter text" type="email" />)
    const input = screen.getByTestId('input') as HTMLInputElement

    expect(input.placeholder).toBe('Enter text')
    expect(input.type).toBe('email')
  })

  it('can be disabled', () => {
    render(<Input data-testid="input" disabled />)
    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input).toBeDisabled()
  })
})
