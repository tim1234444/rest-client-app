import { redirect } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import AboutUsContainer from '@/src/components/containers/AboutUsContainer';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const t = await getTranslations('root');
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex items-center flex-col">
      <div>
        {t('helloback')}, {data.user?.email}
      </div>
      <AboutUsContainer />
    </div>
  );
}
