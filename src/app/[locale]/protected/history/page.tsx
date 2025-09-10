import { createClient } from '@/src/lib/supabase/server';
import Row from '@/src/components/Row/Row';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/components/ui/card';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function History() {
  const supabase = await createClient();
  const t = await getTranslations('history');
  const { data, error: err } = await supabase.auth.getUser();
  if (err || !data?.user) {
    redirect('/auth/login');
  }
  const { data: user } = await supabase.auth.getUser();
  const userInfo = user.user;
  const { data: history_and_analytics, error } = await supabase
    .from('history_and_analytics')
    .select(
      'request_duration, response_status_code, request_timestamp, request_method, request_size, response_size, error_details, endpoint_url, id, request_headers, request_body',
    )
    .eq('user_id', userInfo?.id)
    .order('request_timestamp', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Something went wrong fetching history</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!history_and_analytics || history_and_analytics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>No requests yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('notrequst')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-border text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">{t('col1')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('col2')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('col3')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('col4')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('col5')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('col6')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('col7')}</th>
                <th className="px-4 py-2 text-left font-medium">{t('col8')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history_and_analytics.map((row, index) => {
                return <Row key={index} index={index} value={row} id={row.id} />;
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
