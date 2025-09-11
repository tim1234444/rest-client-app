import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

export default async function Variables() {
  const supabase = await createClient();

  const { data, error: err } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (err || !data?.user) {
    redirect('/auth/login');
  }
  const LazyVariablesForm = dynamic(() => import('@/src/components/VariablesForm/VariablesForm'), {
    loading: () => <p>Loading...</p>,
  });
  return <LazyVariablesForm id={id} />;
}
