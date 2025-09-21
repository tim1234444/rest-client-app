import FooterInfo from '@/src/components/FooterInfo/FooterInfo';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Мокаем useTranslations
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));



describe('FooterInfo', () => {
  it('renders team links', () => {
    render(<FooterInfo />);

    const aliceLink = screen.getByText('Alexander Kuralenko');
    

    expect(aliceLink).toBeInTheDocument();
   
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
