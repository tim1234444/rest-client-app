import { PostgrestError } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import { ITableProps } from '../Row/Row';

const TableHistory = dynamic(() => import('../TableHistory/TableHistory'), {
  loading: () => <p>Loading...</p>,
});

export default function HistoryContainer({
  history_and_analytics,
  error,
}: {
  history_and_analytics: ITableProps[] | null;
  error: PostgrestError | null;
}) {
  return <TableHistory history_and_analytics={history_and_analytics} error={error} />;
}
