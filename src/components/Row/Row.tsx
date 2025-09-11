import RowButton from '../RowButton/RowButton';
import { randomUUID } from 'crypto';
export interface ITableProps {
  request_duration: number;
  response_status_code: number;
  request_timestamp: string;
  request_method: string;
  request_size: number;
  response_size: number;
  error_details: string;
  endpoint_url: string;
  id: number;
  request_headers: string;
  request_body: string;
}

export default function Row({
  uuidKey,
  value,
  id,
}: {
  uuidKey: string;
  value: ITableProps;
  id: number;
}) {
  return (
    <>
      <tr key={uuidKey} data-id={id} className="hover:bg-muted/30 cursor-pointer">
        {Object.entries(value).map(([key, val], i) => {
          let displayValue = val;
          if (key === 'request_headers' || key === 'request_body' || key === 'id') {
            return null;
          }
          if (key === 'request_timestamp' && val) {
            displayValue = new Date(val as string).toLocaleString('en-GB', {
              dateStyle: 'short',
              timeStyle: 'medium',
            });
          }
          const uuid = randomUUID();
          return (
            <td
              key={uuid}
              className={`px-4 py-2 text-sm ${
                i === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
              }`}
            >
              {displayValue}
            </td>
          );
        })}
        <td className="text-muted-foreground px-4 py-2 text-sm">
          {' '}
          <RowButton value={value}></RowButton>
        </td>
      </tr>
    </>
  );
}
