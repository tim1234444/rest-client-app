'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
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
export default function RowButton({ value }: { value: IProps }) {
  const router = useRouter();
  const t = useTranslations('history');
  return (
    <button
      onClick={() => {
        //   Редирект на RestClient
        const requestMethod = value.request_method;
        const requestUrl = window.btoa(value.endpoint_url);
        const requestHeader = value.request_headers ? `?${value.request_headers}` : '';
        const requestBody = value.request_body ? `/${window.btoa(value.request_body)}` : '';
        router.push(
          '/protected/client/' + requestMethod + '/' + requestUrl + requestBody + requestHeader,
        );
      }}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
    >
      {t('restore')}
    </button>
  );
}
