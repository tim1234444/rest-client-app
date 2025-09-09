'use client';

import { createClient } from '@/src/lib/supabase/client';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations('login')

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return <Button onClick={logout}>{t('logout')}</Button>;
}
