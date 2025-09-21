import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Label } from '../../components/ui/label'


describe('Label component', () => {
  it('renders correctly with children', () => {
    render(<Label data-testid="label">My Label</Label>)
    const label = screen.getByTestId('label')

    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('My Label')
  })

  it('accepts htmlFor prop', () => {
    render(<Label data-testid="label" htmlFor="input-id">My Label</Label>)
    const label = screen.getByTestId('label')

    expect(label).toHaveAttribute('for', 'input-id')
  })

  it('applies additional className', () => {
    render(<Label data-testid="label" className="custom-class">Label</Label>)
    const label = screen.getByTestId('label')

    expect(label).toHaveClass('custom-class')
  })
})
