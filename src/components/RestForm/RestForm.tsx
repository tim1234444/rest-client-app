'use client';
import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { parseUrlParams } from '@/src/utils/parseUrlParams';
import { useSnippetGenerator } from '@/src/hooks/useSnippetGenerator';
import { getVariable } from '@/src/utils/getVariable';
import { headersList, VariableItem } from '@/src/type/type';
import { useRestClientForm } from '@/src/hooks/useRestClientForm';
type Props = {
  id: string | undefined;
};

export default function RestClient({ id = '' }: Props) {
  // Получение параметров для востановления полей из URL
  const t = useTranslations('client');
  const params: { params: string[] } = useParams();
  const searchParams = useSearchParams();

  // Получение значений из параметров и привязка их к переменным
  const [parseMethod, parseUrl, parseBody, parseHeaders] = parseUrlParams(
    params?.params,
    searchParams,
  );

  // Объяление состояний для отслеживания значений input
  const [method, setMethod] = useState(parseMethod);
  const [url, setUrl] = useState(parseUrl);
  const [body, setBody] = useState(parseBody);
  const [headersList, setHeadersList] = useState<headersList>(parseHeaders);
  // Тип данных в текстовом редакторе
  const [typeBody, setTypeBody] = useState('JSON');
  const [lang, setLang] = useState({
    language: 'curl',
    variant: 'curl',
  });
  // Создание Header
  const [headerName, setHeaderName] = useState('');
  const [headerValue, setHeaderValue] = useState('');

  const variables: VariableItem[] = getVariable(id);
  const snippet = useSnippetGenerator({ method, url, headersList, body, lang, variables });
  const { handleSubmit, isLoading, res, status, fetchError, errors } = useRestClientForm({
    url,
    method,
    body,
    headersList,
    variables,
  });

  return (
    <>
      <Card className="max-w-3xl mx-auto p-4">
        <CardHeader>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
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
                {headersList.map((item) => {
                  const uuid = self.crypto.randomUUID();
                  return (
                    <li key={uuid} className="flex justify-between items-center border p-2 rounded">
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
                  );
                })}
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
        <>
          {Boolean(status) && !fetchError && (
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

        {fetchError && <div className="text-sm text-red-500">{fetchError}</div>}
        {!fetchError && !Boolean(status) && !res && (
          <div className="border rounded p-4 text-gray-400 h-full flex items-center justify-center">
            {t('response')}
          </div>
        )}
      </div>
    </>
  );
}
