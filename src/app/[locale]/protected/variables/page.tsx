import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
import VariablesForm from '@/src/components/VariablesForm/VariablesForm';

export default async function Variables() {
  const supabase = await createClient();

  const { data, error: err } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (err || !data?.user) {
    redirect('/auth/login');
  }

  return (
    <>
      <VariablesForm id={id} />
    </>
  );
}
