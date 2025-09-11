import { randomUUID } from 'crypto';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { getTranslations } from 'next-intl/server';
import Row from '../Row/Row';
import type { ITableProps } from '../Row/Row';
import { PostgrestError } from '@supabase/supabase-js';
export default async function TableHistory({
  history_and_analytics,
  error,
}: {
  history_and_analytics: ITableProps[] | null;
  error: PostgrestError | null;
}) {
  const t = await getTranslations('history');

  if (error) {
    console.error('Supabase error:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('error')}</CardTitle>
          <CardDescription>{t('errordescription')}</CardDescription>
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
          <CardDescription>{t('notrequstdescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('notrequstmssage')}</p>
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
              {history_and_analytics.map((row) => {
                return (<Row key={randomUUID()} uuidKey={randomUUID()} value={row} id={row.id} />)
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
