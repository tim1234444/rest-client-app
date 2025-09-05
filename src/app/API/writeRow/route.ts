
// import { createClient } from '@/src/lib/supabase/server';
// import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res = await request.json();
  const userFetch = await fetch(res.url, {
    method: res.method
  })
  console.log(userFetch.json());
  // const startTime = process.hrtime.bigint();
  // const supabase = await createClient();

  // const date = new Date(Date.now()).toLocaleString("en-EN");
  // const { data, error } = await supabase
  //   .from('history_and_analytics')
  //   .insert([
  //     {
  //       request_duration: 0,
  //       response_status_code: res.stat,
  //       request_timestamp: date,
  //       request_method: res.method,
  //       request_size: 555,
  //       response_size: 666,
  //       error_details: 'no errors',
  //       endpoint_url: res.url,
  //       user_id: 'ksander-88@yandex.ru',
  //     },
  //   ])
  //   .select();
  // console.log(error)
  // const endTime = process.hrtime.bigint();
  // const durationNs = endTime - startTime;
  // const durationMs = Math.floor(Number(durationNs) / 1000000);
  // console.log(durationMs)

  // if (data !== null && data[0].id !== null) {
  //   console.log('Updating duration for ID:', data[0].id);
  //   const supabase = await createClient();
  //   const { } = await supabase
  //     .from('history_and_analytics')
  //     .update({ request_duration: durationMs })
  //     .eq('id', data[0].id)
  //     .select()
  //   if (error) {
  //     console.error('Update error:', error);
  //   } else {
  //     console.log('Update successful:');
  //   }
  // };
  return Response.json({ res });
}
