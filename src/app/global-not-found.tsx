// Import global styles and fonts
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="mx-auto w-96">
          <h1 className="text-center">404 - Page Not Found</h1>
          <p className="text-center">This page does not exist.</p>
          <Link href={'/'}>Back to Home page</Link>
        </div>
      </body>
    </html>
  );
}
