import { EnvVarWarning } from '@/src/components/env-var-warning';
import { AuthButton } from '@/src/components/auth-button';
import { ThemeSwitcher } from '@/src/components/theme-switcher';
import { hasEnvVars } from '@/src/lib/utils';
import { Link } from '@/src/i18n/navigation';
import Error from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { getTranslations } from 'next-intl/server';
import LangSwitcher from '@/src/components/LangSwitcher/LangSwitcher';
import FooterInfo from '@/src/components/FooterInfo/FooterInfo';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={`/`}>{tn('home')}</Link>
              <Link href={`/protected/client`}>{tn('client')}</Link>
              <Link href={`/protected/history`}>{tn('history')}</Link>
              <Link href={'/protected/variables'}>{tn('var')}</Link>
            </div>
            <LangSwitcher />
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-6xl p-5">
          <ErrorBoundary fallback={<Error />}>{children}</ErrorBoundary>
        </div>

        <footer className="w-full flex flex-col  items-center justify-center border-t mx-auto text-center text-xs gap-5 py-5">
          <FooterInfo />
          <div className="flex items-center gap-20">
            <p className="text-sm">2025</p>
            <p>
            {t('co')}{' '}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              {t('supabase')}
            </a>
          </p>
            <ThemeSwitcher />
          </div>
        </footer>
      </div>
    </main>
  );
}
