import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Variables() {
  const supabase = await createClient();

  const { data, error: err } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (err || !data?.user) {
    redirect('/auth/login');
  }
  const LazyVariablesForm = React.lazy(
    () => import('@/src/components/VariablesForm/VariablesForm'),
  );
  return <LazyVariablesForm id={id} />;
}
