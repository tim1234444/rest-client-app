import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

describe('Button', () => {
  test('renders with default variant and size', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByText('Default');
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('bg-primary');
    expect(btn.className).toContain('h-9');
  });

  test('renders with secondary variant and sm size', () => {
    render(
      <Button variant="secondary" size="sm">
        Small Secondary
      </Button>,
    );
    const btn = screen.getByText('Small Secondary');
    expect(btn.className).toContain('bg-secondary');
    expect(btn.className).toContain('h-8');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">With class</Button>);
    const btn = screen.getByText('With class');
    expect(btn.className).toContain('custom-class');
  });

  test('renders as child using Slot', () => {
    render(
      <Button asChild>
        <Link href="/test">Link Button</Link>
      </Button>,
    );
    const link = screen.getByText('Link Button');
    expect(link.tagName).toBe('A');
    expect(link.className).toContain('bg-primary');
  });

  test('handles onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByText('Click Me');
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled button has correct class and is not clickable', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    const btn = screen.getByText('Disabled');
    expect(btn).toHaveAttribute('disabled');
    expect(btn.className).toContain('opacity-50');
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
