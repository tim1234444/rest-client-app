import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
import VariablesContainer from '@/src/components/containers/VariablesContainer';

export default async function Variables() {
  const supabase = await createClient();

  const { data, error: err } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (err || !id) {
    redirect('/auth/login');
  }

  return <VariablesContainer id={id} />;
}
