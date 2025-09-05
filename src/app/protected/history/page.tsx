import { createClient } from '@/src/lib/supabase/server';
import Row from '@/src/components/Row/Row';
export default async function History() {
  const supabase = await createClient();
  const { data: history_and_analytics, error } = await supabase
    .from('history_and_analytics')
    .select(
      'request_duration, response_status_code, request_timestamp, request_method, request_size, response_size, error_details, endpoint_url'
    );

  if (error) {
    console.error('Supabase error:', error);
    return <div>Error: {error.message}</div>;
  }

  if (history_and_analytics.length === 0)
    return <p>You havent executed any requests, Its empty here.</p>;

  return (
    <div>
      <table border={1}>
        <caption>History and analytics</caption>
        <thead>
          <tr>
            <th>Request Duration: </th>
            <th>Response Status Code: </th>
            <th>Request Timestamp: </th>
            <th>Request Method: </th>
            <th>Request Size: </th>
            <th>Response Size: </th>
            <th>Error Details: </th>
            <th>Endpoint/URL: </th>
          </tr>
        </thead>
        <tbody>
          {history_and_analytics.map((row, index) => (
            <Row key={index} index={index} value={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
