import { EnvVarWarning } from '@/src/components/env-var-warning';
import { AuthButton } from '@/src/components/auth-button';
import { ThemeSwitcher } from '@/src/components/theme-switcher';
import { hasEnvVars } from '@/src/lib/utils';
import { Link } from '@/src/i18n/navigation';
import LangSwitcher from '@/src/components/LangSwitcher/LangSwitcher';
import { getTranslations } from 'next-intl/server';
import StickyNavWrapper from '@/src/components/Header/StickyNavWrapper';
import FooterInfo from '@/src/components/FooterInfo/FooterInfo';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('root');
  const tf = await getTranslations('footer');
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <StickyNavWrapper>
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-20">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                <Link href={'/'}>{t('title')}</Link>
              </div>
              <LangSwitcher />
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </nav>
        </StickyNavWrapper>

        {children}

        <footer className="w-full flex flex-col  items-center justify-center border-t mx-auto text-center text-xs gap-5 py-5">
          <FooterInfo />
          <div className="flex items-center gap-20">
            <p className="text-sm">2025</p>
            <p>
              {tf('co')}{' '}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                {tf('supabase')}
              </a>
            </p>
            <ThemeSwitcher />
          </div>
        </footer>
      </div>
    </main>
  );
}
