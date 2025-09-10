'use client';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Request } = require('postman-collection');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Codegen = require('postman-code-generators');
import { Editor } from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { schema } from '@/src/schemas';
import { ValidationError } from 'yup';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
type ReplaceURLParams = {
  method?: string;
  url?: string;
  headers?: string;
  body?: string;
};
type headersList = {
  key: string;
  value: string;
}[];
type DataType = {
  url: string;
  method: string;
};

export default function RestClient() {
  // Получение параметров для востановления полей из URL
  const params: { params: string[] } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('client');

  // Получение значений из параметров и привязка их к переменным
  const [parseMethod, parseUrl, parseBody, parseHeaders] = useMemo(() => {
    const arr = params?.params ?? [];

    const method = arr[0] ?? 'GET';
    const url = arr[1] ? atob(decodeURIComponent(arr[1])) : '';
    const body = arr[2] ? atob(decodeURIComponent(arr[2])) : '';
    const headers = Array.from(searchParams.entries()).map(([headerName, headerValue]) => ({
      key: headerName,
      value: headerValue,
    }));
    return [method, url, body, headers];
  }, [params.params, searchParams]);

  // Объяление состояний для отслеживания значений input
  const [method, setMethod] = useState(parseMethod);
  const [url, setUrl] = useState(parseUrl);
  const [body, setBody] = useState(parseBody);
  const [headersList, setHeadersList] = useState<headersList>(parseHeaders);

  const [snippet, setSnippet] = useState('');
  const [lang, setLang] = useState({
    language: 'curl',
    variant: 'curl',
  });
  useEffect(() => {
    const request = new Request({
      url: url,
      method: method,
      header: headersList,
      body: {
        mode: 'raw',
        raw: body,
      },
    });

    const options = {
      indentCount: 2,
      indentType: 'Space',
      trimRequestBody: true,
    };

    Codegen.convert(
      lang.language,
      lang.variant,
      request,
      options,
      (error: Error | null, snippet: string) => {
        if (error) {
          console.error(error);
        } else {
          console.log(snippet);
          setSnippet(snippet);
        }
      },
    );
  }, [method, url, body, headersList, lang]);
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
    const headersObj = Object.fromEntries(headers.map((h) => [h.key, h.value]));
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
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => fetchFrom(e, headersList, body)} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="method">{t('method')}</Label>
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
              <Label htmlFor="url">{t('url')}</Label>
              <Input
                type="text"
                id="url"
                name="url"
                placeholder={t('enterurl')}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
              <div className="text-sm text-red-500">{errors.url || '\u00A0'}</div>
            </div>

            <div className="grid gap-2">
              <Label>{t('headers')}</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={t('name')}
                  value={headerName}
                  onChange={(e) => setHeaderName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  placeholder={t('value')}
                  value={headerValue}
                  onChange={(e) => setHeaderValue(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (headerName && headerValue) {
                      setHeadersList((prev) => {
                        const updated = [...prev, { key: headerName, value: headerValue }];

                        return updated;
                      });
                    }
                  }}
                >
                  {t('add')}
                </Button>
              </div>
              <ul className="space-y-1 mt-2">
                {headersList.map((item) => (
                  <li
                    key={item.key + item.value}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <div className="flex gap-4 justify-between w-[90%] mx-auto">
                      <p className="font-medium">{item.key}</p>
                      <p>{item.value}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-500 hover:underline"
                      onClick={() =>
                        setHeadersList((prev) => prev.filter((h) => h.key !== item.key))
                      }
                    >
                      {t('delete')}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="typeBody">Code Generator</Label>
              <select
                id="typeCode"
                name="typeCode"
                value={`${lang.language} ${lang.variant}`}
                onChange={(e) => {
                  const langAndVariant = e.target.value.split(' ');
                  setLang({
                    language: langAndVariant[0],
                    variant: langAndVariant[1],
                  });
                }}
                className="border rounded-md px-3 py-1 w-32"
              >
                <option value="curl curl">curl</option>
                <option value="javascript fetch">JavaScript (Fetch API)</option>
                <option value="javascript xhr">JavaScript (XHR)</option>
                <option value="nodejs axios">NodeJS</option>
                <option value="python requests">Python</option>
                <option value="java okhttp">Java</option>
                <option value="csharp restsharp">C#</option>
                <option value="go native">Go</option>
              </select>
              <Editor
                height="200px"
                defaultLanguage="text"
                value={snippet}
                options={{ readOnly: true, minimap: { enabled: false } }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="typeBody">{t('type')}</Label>
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
              {isLoading ? `${t('sending')}` : `${t('send')}`}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="flex-1">
        {res && (
          <>
            {status && !fetchError && (
              <>
                <h2 className="mb-2">
                  {t('status')}: {status}
                </h2>
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
            {t('response')}
          </div>
        )}
      </div>
    </>
  );
}
