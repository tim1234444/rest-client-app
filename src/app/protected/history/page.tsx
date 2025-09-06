import { createClient } from '@/src/lib/supabase/server';
import Row from '@/src/components/Row/Row';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/components/ui/card';

export default async function History() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const userInfo = user.user;
  const { data: history_and_analytics, error } = await supabase
    .from('history_and_analytics')
    .select(
      'request_duration, response_status_code, request_timestamp, request_method, request_size, response_size, error_details, endpoint_url',
    )
    .eq('user_id', userInfo?.id);

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
          <CardTitle>History and analytics</CardTitle>
          <CardDescription>No requests yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You haven’t executed any requests. It’s empty here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History and analytics</CardTitle>
        <CardDescription>Overview of executed requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-border text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Request Duration</th>
                <th className="px-4 py-2 text-left font-medium">Response Status Code</th>
                <th className="px-4 py-2 text-left font-medium">Request Timestamp</th>
                <th className="px-4 py-2 text-left font-medium">Request Method</th>
                <th className="px-4 py-2 text-left font-medium">Request Size</th>
                <th className="px-4 py-2 text-left font-medium">Response Size</th>
                <th className="px-4 py-2 text-left font-medium">Error Details</th>
                <th className="px-4 py-2 text-left font-medium">Endpoint / URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history_and_analytics.map((row, index) => (
                <Row key={index} index={index} value={row} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
