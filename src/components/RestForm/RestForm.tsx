'use client';

import { Editor } from '@monaco-editor/react';
import { useMemo, useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { schema } from '@/src/schemas';
import { ValidationError } from 'yup';
import { useParams, useSearchParams } from 'next/navigation';
type ReplaceURLParams = {
  method?: string;
  url?: string;
  headers?: string;
  body?: string;
};
type headersList = {
  headerValue: string;
  headerName: string;
}[];
type DataType = {
  url: string;
  method: string;
};

export default function RestClient() {
  // Получение параметров для востановления полей из URL
  const params: { params: string[] } = useParams();
  const searchParams = useSearchParams();

  // Получение значений из параметров и привязка их к переменным
  const [parseMethod, parseUrl, parseBody, parseHeaders] = useMemo(() => {
    const arr = params?.params ?? [];

    const method = arr[0] ?? 'GET';
    const url = arr[1] ? atob(decodeURIComponent(arr[1])) : '';
    const body = arr[2] ? atob(decodeURIComponent(arr[2])) : '';
    const headers = Array.from(searchParams.entries()).map(([headerName, headerValue]) => ({
      headerName,
      headerValue,
    }));
    return [method, url, body, headers];
  }, [params.params, searchParams]);

  // Объяление состояний для отслеживания значений input
  const [method, setMethod] = useState(parseMethod);
  const [url, setUrl] = useState(parseUrl);
  const [body, setBody] = useState(parseBody);
  const [headersList, setHeadersList] = useState<headersList>(parseHeaders);

  // Тип данных в текстовом редакторе
  const [typeBody, setTypeBody] = useState('JSON');

  // Создание Header
  const [headerName, setHeaderName] = useState('');
  const [headerValue, setHeaderValue] = useState('');

  // Ошибки валидации
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Состояние для отслеживание фазы ожидания ответа запроса
  const [isLoading, setIsLoading] = useState(false);

  // Отслеживание состояние запроса, ошибок и результат запроса
  const [res, serRes] = useState('');
  const [status, setStatus] = useState<number>();
  const [fetchError, setFetchError] = useState('');

  // Функция валидации
  async function Validate(formData: DataType) {
    try {
      await schema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof ValidationError) {
        const errors = err.inner.reduce(
          (acc, curr) => {
            if (curr.path) {
              acc[curr.path] = curr.message;
            }
            return acc;
          },
          {} as Record<string, string>,
        );
        setErrors(errors);
      }
      return false;
    }
  }

  // Отправка запроса
  const fetchFrom = async function (
    e: React.FormEvent<HTMLFormElement>,
    headers: headersList,
    body: string,
  ) {
    e.preventDefault();
    // Сбрасывание ошибок валидации, результата запроса, статуса ответа, ошибки запроса
    setErrors({});
    serRes('');
    setStatus(0);
    setFetchError('');

    // Получение и преобразование всех необходимых полей для изменения URL
    const headersObj = Object.fromEntries(headers.map((h) => [h.headerName, h.headerValue]));
    const params = new URLSearchParams(headersObj).toString();
    const requestUrl = window.btoa(url);
    const requestBody = window.btoa(body);
    const requestMethod = method;
    // Замена URL
    replaseURL({
      method: requestMethod,
      url: '/' + requestUrl,
      headers: '?' + params,
      body: '/' + requestBody,
    });

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as unknown as DataType;
    // Вызов функции Валидации
    const isValidate = await Validate(values);
    if (isValidate) {
      setIsLoading(true);
      const data = await fetch('/API/writeRow', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          method: formData.get('method'),
          url: formData.get('url'),
          headers: headersObj,
          body: body,
        }),
      });

      const res = await data.json();
      setIsLoading(false);
      if (data.status === 200) {
        serRes(res.data);
        setStatus(res.status);
      } else if (data.status === 500) {
        console.log(data.status);
        setFetchError(res.error);
      }
    }
  };

  // Функция замены URL
  const replaseURL = function ({
    method = '',
    url = '',
    headers = '',
    body = '',
  }: ReplaceURLParams) {
    window.history.replaceState(null, '', `/protected/client/${method}` + url + body + headers);
  };
  return (
    <>
      <Card className="max-w-3xl mx-auto p-4">
        <CardHeader>
          <CardTitle className="text-2xl">REST Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => fetchFrom(e, headersList, body)} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="method">Method</Label>
              <select
                id="method"
                name="method"
                value={method}
                onChange={(e) => {
                  setMethod(e.target.value);
                }}
                className="border rounded-md px-3 py-1"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PATCH">PATCH</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <div className="text-sm text-red-500">{errors.method || '\u00A0'}</div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                type="text"
                id="url"
                name="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
              <div className="text-sm text-red-500">{errors.url || '\u00A0'}</div>
            </div>

            <div className="grid gap-2">
              <Label>Headers</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Header Name"
                  value={headerName}
                  onChange={(e) => setHeaderName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  placeholder="Header Value"
                  value={headerValue}
                  onChange={(e) => setHeaderValue(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (headerName && headerValue) {
                      setHeadersList((prev) => {
                        const updated = [...prev, { headerName, headerValue }];

                        return updated;
                      });
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <ul className="space-y-1 mt-2">
                {headersList.map((item) => (
                  <li
                    key={item.headerName + item.headerValue}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <div className="flex gap-4 justify-between w-[90%] mx-auto">
                      <p className="font-medium">{item.headerName}</p>
                      <p>{item.headerValue}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-500 hover:underline"
                      onClick={() =>
                        setHeadersList((prev) =>
                          prev.filter((h) => h.headerName !== item.headerName),
                        )
                      }
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="typeBody">Body Type</Label>
              <select
                id="typeBody"
                name="typeBody"
                value={typeBody}
                onChange={(e) => setTypeBody(e.target.value)}
                className="border rounded-md px-3 py-1 w-32"
              >
                <option value="Text">Text</option>
                <option value="JSON">JSON</option>
              </select>
              <Editor
                key={typeBody}
                height="200px"
                defaultLanguage={typeBody.toLowerCase()}
                value={body}
                onChange={(val) => setBody(val ?? '')}
                options={{ readOnly: false, minimap: { enabled: false } }}
              />
            </div>
            <Button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && (
                <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>
              )}
              {isLoading ? 'Sending…' : 'Send Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="flex-1">
        {res && (
          <>
            {status && !fetchError && (
              <>
                <h2 className="mb-2">Status: {status}</h2>
                <Editor
                  height="200px"
                  defaultLanguage="json"
                  value={typeof res === 'string' ? res : JSON.stringify(res, null, 2)}
                  options={{ readOnly: true, minimap: { enabled: false } }}
                />
              </>
            )}
          </>
        )}

        {fetchError && <div className="text-sm text-red-500">{fetchError}</div>}
        {!fetchError && !res && (
          <div className="border rounded p-4 text-gray-400 h-full flex items-center justify-center">
            Response will appear here
          </div>
        )}
      </div>
    </>
  );
}
