import React from 'react';
import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function History() {
  const supabase = await createClient();
  const { data, error: err } = await supabase.auth.getUser();
  if (err || !data?.user) {
    redirect('/auth/login');
  }
  const LazyTableHistory = React.lazy(() => import('@/src/components/TableHistory/TableHistory'));
  const userInfo = data.user;

  const { data: history_and_analytics, error } = await supabase
    .from('history_and_analytics')
    .select(
      'request_duration, response_status_code, request_timestamp, request_method, request_size, response_size, error_details, endpoint_url, id, request_headers, request_body',
    )
    .eq('user_id', userInfo?.id)
    .order('request_timestamp', { ascending: false });

  return <LazyTableHistory history_and_analytics={history_and_analytics} error={error} />;
}
