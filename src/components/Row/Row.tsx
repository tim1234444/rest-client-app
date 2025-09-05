'use client';

interface IProps {
  request_duration: number;
  response_status_code: number;
  request_timestamp: string;
  request_method: string;
  request_size: number;
  error_details: string;
  endpoint_url: string;
  user_id: string;
}

export default function Row({ index, value }: { index: number; value: IProps }) {
  return (
    <tr
      key={index}
      onClick={(e) => {
        console.log(e.currentTarget, e.target);
      }}
    >
      {Object.entries(value).map(([, value], index) => (
        <td key={index}>{value}</td>
      ))}
    </tr>
  );
}
