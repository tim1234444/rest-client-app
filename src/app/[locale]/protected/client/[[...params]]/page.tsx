import RestClientContainer from '@/src/components/containers/RestClientContainer';
import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ClientPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const id = data.user?.id;

  if (!id || error) redirect('/auth/login');

  return <RestClientContainer id={id} />;
}
