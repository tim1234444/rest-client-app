'use client';
import { useRouter } from 'next/navigation'
interface IProps {
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

export default function Row({ index, value, id }: { index: number; value: IProps; id: number }) {
  const router = useRouter();
  return (
    <tr
      key={index}
      data-id={id}
      onClick={() => {
        const requstMethod = value.request_method;
        const  requestUrl = window.btoa(value.endpoint_url);
        const  requestHeader = value.request_headers ? `?${value.request_headers}` : '';
        const  requestBody = value.request_body ? `/${window.btoa(value.request_body)}` : '';
        router.push('/protected/client/' + requstMethod +'/' + requestUrl + requestBody + requestHeader);
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
            {displayValue}
          </td>
        );
      })}
    </tr>
  );
}
