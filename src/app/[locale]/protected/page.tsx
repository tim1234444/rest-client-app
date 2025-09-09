import { redirect } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';
import { getTranslations } from 'next-intl/server';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const t = await getTranslations('root');
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth/login');
  }

  return (
    <>
      <div>{t('helloback')}, {data.user?.email}</div>
    </>
  );
}
