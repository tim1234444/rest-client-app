'use server';
import { createClient } from '@/src/lib/supabase/server';

export async function fetchFrom() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('history_and_analytics')
    .insert([
      {
        request_size: 122332,
        response_size: 122332,
        request_duration: 122332,
        response_status_code: 200,
        request_timestamp: '2025-09-05 15:37:16 +03:00',
        request_method: 'POST',
        error_details: 'no errors',
        endpoint_url: 'usr',
        user_id: 'string',
      },
    ])
    .select();
  console.log('xxxxx', data, error);
}
