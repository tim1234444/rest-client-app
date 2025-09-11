import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
export default async function Client() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (error || !data?.user) {
    redirect('/auth/login');
  }
  const LazyRestClient = dynamic(() => import('@/src/components/RestForm/RestForm'), {
    loading: () => <p>Loading...</p>,
  });
  return <LazyRestClient id={id} />;
}
