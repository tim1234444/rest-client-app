'use client';

interface IProps {
  request_duration: number;
  response_status_code: number;
  request_timestamp: string;
  request_method: string;
  request_size: number;
  response_size: number;
  error_details: string;
  endpoint_url: string;
}

export default function Row({ index, value }: { index: number; value: IProps }) {
  return (
    <tr
      key={index}
      onClick={(e) => {
        console.log(e.currentTarget, e.target);
      }}
      className="hover:bg-muted/30 cursor-pointer"
    >
      {Object.entries(value).map(([key, val], i) => {
        let displayValue = val;

        if (key === 'request_timestamp' && val) {
          displayValue = new Date(val as string).toLocaleString('en-GB', {
            dateStyle: 'short',
            timeStyle: 'medium',
          });
        }

        return (
          <td
            key={i}
            className={`px-4 py-2 text-sm ${
              i === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
            }`}
          >
            {displayValue ?? '—'}
          </td>
        );
      })}
    </tr>
  );
}
