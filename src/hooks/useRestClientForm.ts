import { useState } from 'react';
import { sendRequest } from '@/src/utils/sendRequest';
import { Validate } from '@/src/utils/validate';
import { buildHeaders, buildRequestData } from '@/src/utils/buildHeadersAndData';
import { replaseURL } from '@/src/utils/replaceUrl';
import type { DataType, headersList, VariableItem } from '@/src/type/type';

type Props = {
  url: string;
  method: string;
  body: string;
  headersList: headersList;
  variables: VariableItem[];
};

export function useRestClientForm({ url, method, body, headersList, variables }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState('');
  const [status, setStatus] = useState<number>(0);
  const [fetchError, setFetchError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Сбрасывание ошибок валидации, результата запроса, статуса ответа, ошибки запроса
    setErrors({});
    setRes('');
    setStatus(0);
    setFetchError('');
    // Замена переменных на значения в header
    const headersObj = buildHeaders(headersList, variables);
    const params = new URLSearchParams(headersObj).toString();
    // Замена переменных на значения в URL, body и
    const {
      url: requestUrl,
      body: requestBody,
      method: requestMethod,
    } = buildRequestData(url, body, method, variables);

    // Замена URL
    replaseURL({
      method: requestMethod,
      url: '/' + window.btoa(requestUrl),
      headers: '?' + params,
      body: '/' + window.btoa(requestBody),
    });

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as unknown as DataType;
    // Вызов функции Валидации
    const isValidate = await Validate(values, setErrors);

    if (isValidate) {
      setIsLoading(true);
      const { status: responseStatus, data: responseData } = await sendRequest({
        method: requestMethod,
        url: requestUrl,
        headers: headersObj,
        body: requestBody,
      });
      setIsLoading(false);

      if (responseStatus === 200) {
        setRes(responseData.data);
        setStatus(responseData.status);
      } else if (responseStatus === 500) {
        setFetchError(responseData.error);
      }
    }
  };

  return { handleSubmit, isLoading, res, status, fetchError, errors };
}
