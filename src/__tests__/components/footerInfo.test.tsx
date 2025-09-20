import FooterInfo from '@/src/components/FooterInfo/FooterInfo';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Мокаем useTranslations
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/src/components/FooterInfo/teamData', () => ({
  teamData: [
    { name: 'Alice', gitHubUrl: 'https://github.com/alice' },
    { name: 'Bob', gitHubUrl: 'https://github.com/bob' },
  ],
}));

describe('FooterInfo', () => {
  it('renders team links', () => {
    render(<FooterInfo />);

    const aliceLink = screen.getByText('Alice');
    const bobLink = screen.getByText('Bob');

    expect(aliceLink).toBeInTheDocument();
    expect(aliceLink).toHaveAttribute('href', 'https://github.com/alice');

    expect(bobLink).toBeInTheDocument();
    expect(bobLink).toHaveAttribute('href', 'https://github.com/bob');
  });

  it('renders RS School logo link', () => {
    render(<FooterInfo />);

    const rsLink = screen.getByRole('link', { name: 'rsSchoolLogo' });
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });

  it('renders RS School image', () => {
    render(<FooterInfo />);

    const image = screen.getByAltText('rsSchoolLogo');
    expect(image).toHaveAttribute('src', '/rss-logo.svg');
  });
});
