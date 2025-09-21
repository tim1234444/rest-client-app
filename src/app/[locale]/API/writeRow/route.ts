import { createClient } from '@/src/lib/supabase/server';
// import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Инициализация supabase и получение данных пользователя
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const userInfo = user.user;

  // Получение данных запроса, включающие URL, method, headers, body
  const res = await request.json();
  // Инициализация всех необходимых перменных для сохранения
  const date = new Date(Date.now()).toLocaleString('en-EN');
  const bodySize = res.body ? new TextEncoder().encode(res.body).length : 0;
  let responseSize: number = 0;
  let durationMs: number = 0;
  let status: number = 0;
  const body = res.body ?? '';
  const headers = res.headers ?? '';
  try {
    const params = new URLSearchParams(headers).toString();

    // Начало отсчета времени запроса
    const startTime = process.hrtime.bigint();

    // Блок проверки URL на валидность
    try {
      new URL(res.url);
    } catch {
      // В случае некоректного URL выбрасывается ошибка
      throw new Error('Invalid URL format');
    }

    const userFetch = await fetch(res.url, {
      method: res.method,
      headers,
      body: ['POST', 'PUT', 'PATCH'].includes(res.method) ? res.body : undefined,
    });

    // Конец отсчета времени совершения запроса
    const endTime = process.hrtime.bigint();
    const durationNs = endTime - startTime;
    durationMs = Math.floor(Number(durationNs) / 1000000);

    // Проверка типа ответа и использование правильного метода для парсинга ответа запроса
    let data;
    const contentType = userFetch.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await userFetch.json();
    } else {
      data = await userFetch.text();
    }

    // Получение размера ответа и ошибок при наличии
    responseSize = new TextEncoder().encode(data).length;
    const errorDetails = userFetch.ok ? 'not error' : `HTTP ${userFetch.status}: ${data}`;
    status = userFetch.status;

    // Отправка в базу
    await supabase
      .from('history_and_analytics')
      .insert([
        {
          request_duration: durationMs,
          response_status_code: status,
          request_timestamp: date,
          request_method: res.method,
          request_size: bodySize,
          response_size: responseSize,
          error_details: errorDetails,
          endpoint_url: res.url,
          user_id: userInfo?.id,
          request_headers: params,
          request_body: body,
        },
      ])
      .select();

    return new Response(JSON.stringify({ status: userFetch.status, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // Отправка данных в бд в случае ошибки
    const params = new URLSearchParams(headers).toString();
    await supabase
      .from('history_and_analytics')
      .insert([
        {
          request_duration: durationMs,
          response_status_code: status,
          request_timestamp: date,
          request_method: res.method,
          request_size: bodySize,
          response_size: responseSize,
          error_details: (err as Error).message,
          endpoint_url: res.url,
          user_id: userInfo?.id,
          request_headers: params,
          request_body: body,
        },
      ])
      .select();
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
