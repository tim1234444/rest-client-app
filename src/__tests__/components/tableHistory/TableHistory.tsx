'use client';
import React from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import Row, { ITableProps } from '@/src/components/Row/Row';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';

export default function TableHistoryClient({
  history_and_analytics,
  error,
}: {
  history_and_analytics: ITableProps[] | null;
  error: PostgrestError | null;
}) {
  const t = (key: string) => key;

  if (error) {
    return (
      <Card data-testid="table-history">
        <CardHeader>
          <CardTitle>{t('error')}</CardTitle>
          <CardDescription>{t('errordescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p data-testid="error" className="text-sm text-red-500">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!history_and_analytics || history_and_analytics.length === 0) {
    return (
      <Card data-testid="table-history">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('notrequstdescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p data-testid="empty">{t('notrequstmssage')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="table-history">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <table>
          <thead>
            <tr>
              <th>{t('col1')}</th>
              <th>{t('col2')}</th>
            </tr>
          </thead>
          <tbody>
            {history_and_analytics.map((row) => {
              const uuid = randomUUID();
              return <Row key={uuid} uuidKey={uuid} value={row} id={row.id} />;
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
