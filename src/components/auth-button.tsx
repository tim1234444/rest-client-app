import Link from 'next/link';
import { Button } from './ui/button';
import { createClient } from '@/src/lib/supabase/server';
import { LogoutButton } from './logout-button';
import { getTranslations } from 'next-intl/server';

export async function AuthButton() {
  const supabase = await createClient();
  const t = await getTranslations('root');
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      {t('hey')}, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={'outline'}>
        <Link href="/auth/login">{t('signin')}</Link>
      </Button>
      <Button asChild size="sm" variant={'default'}>
        <Link href="/auth/sign-up">{t('signup')}</Link>
      </Button>
    </div>
  );
}
