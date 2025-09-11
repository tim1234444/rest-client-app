import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';
export default async function Client() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (error || !data?.user) {
    redirect('/auth/login');
  }
  const LazyRestClient = React.lazy(() => import('@/src/components/RestForm/RestForm'));
  return <LazyRestClient id={id} />;
}
