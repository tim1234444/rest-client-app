import RestClient from '@/src/components/RestForm/RestForm';
import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
export default async function Client() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (error || !data?.user) {
    redirect('/auth/login');
  }
  return (
    <>
      <RestClient id={id}/>
    </>
  );
}
