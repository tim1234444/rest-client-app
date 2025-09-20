import { EnvVarWarning } from '@/src/components/env-var-warning';
import { AuthButton } from '@/src/components/auth-button';
import { ThemeSwitcher } from '@/src/components/theme-switcher';
import { hasEnvVars } from '@/src/lib/utils';
import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
import LangSwitcher from '@/src/components/LangSwitcher/LangSwitcher';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/navigation';
import StickyNavWrapper from '@/src/components/Header/StickyNavWrapper';
import FooterInfo from '@/src/components/FooterInfo/FooterInfo';

export default async function Home() {
  const supabase = await createClient();
  const t = await getTranslations('root');

  const { data, error } = await supabase.auth.getUser();
  if (data.user || !error) {
    redirect('/protected');
  }
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
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h1 className="text-center"> {t('hello')}! </h1>

            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </main>
        </div>

        <footer className="w-full flex flex-col  items-center justify-center border-t mx-auto text-center text-xs gap-5 py-5">
          <FooterInfo />
          <div className="flex items-center gap-20">
            <p className="text-sm">2025</p>
            <ThemeSwitcher />
          </div>
        </footer>
      </div>
    </main>
  );
}
