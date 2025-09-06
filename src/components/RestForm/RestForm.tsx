'use client';

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { schema } from '@/src/schemas';
import { ValidationError } from 'yup';

type headersList = {
  headerValue: string;
  headerName: string;
}[];
type DataType = {
  url: string;
  method: string;
};

export default function RestClient() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [typeBody, setTypeBody] = useState('JSON');
  const [headersList, setHeadersList] = useState<headersList>([]);
  const [headerName, setHeaderName] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [method, setMethod] = useState('GET');

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
  const fetchFrom = async function (
    e: React.FormEvent<HTMLFormElement>,
    headers: headersList,
    body: string,
  ) {
    e.preventDefault();
    const headersObj = Object.fromEntries(headers.map((h) => [h.headerName, h.headerValue]));
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as unknown as DataType;
    const isValidate = await Validate(values);
    if (isValidate) {
      const data = await fetch('/api/writeRow', {
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
      console.log(res);
    }
  };

  return (
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
              onChange={(e) => setMethod(e.target.value)}
              className="border rounded-md px-3 py-1"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
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
              onChange={(e) => setUrl(e.target.value)}
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
                    setHeadersList((prev) => [...prev, { headerName, headerValue }]);
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
                  <div className="flex gap-4">
                    <p className="font-medium">{item.headerName}</p>
                    <p>{item.headerValue}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:underline"
                    onClick={() =>
                      setHeadersList((prev) => prev.filter((h) => h.headerName !== item.headerName))
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
          <Button type="submit" className="mt-4 w-full">
            Send Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
