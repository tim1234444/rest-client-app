import { redirect } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth/login');
  } else {
    redirect('/history');
  }

  return (
    <>
      <div>Welcome Back, {data.user?.email}</div>
    </>
  );
}
