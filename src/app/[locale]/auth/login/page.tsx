import dynamic from 'next/dynamic';
import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (data.user || !error) {
    redirect('/protected');
  }
  const LoginForm = dynamic(
    () => import('@/src/components/login-form').then((mod) => mod.LoginForm),
    {
      loading: () => <p>Loading...</p>,
    },
  );
  return (
    <div className="flex flex-1  w-full items-center justify-center p-6 md:p-5">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
