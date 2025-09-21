import { useState, useEffect } from 'react';
import { substitute } from '../utils/substitute';
import { VariableItem } from '../type/type';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Request } = require('postman-collection');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Codegen = require('postman-code-generators');
interface UseSnippetGeneratorProps {
  method: string;
  url: string;
  headersList: { key: string; value: string }[];
  body: string;
  lang: { language: string; variant: string };
  variables: VariableItem[];
}

export function useSnippetGenerator({
  method,
  url,
  headersList,
  body,
  lang,
  variables,
}: UseSnippetGeneratorProps) {
  const [snippet, setSnippet] = useState('');

  useEffect(() => {
    const request = new Request({
      url,
      method,
      header: headersList,
      body: { mode: 'raw', raw: body },
    });

    const options = { indentCount: 2, indentType: 'Space', trimRequestBody: true };

    Codegen.convert(
      lang.language,
      lang.variant,
      request,
      options,
      (error: Error | null, snippet: string) => {
        if (error) {
        } else {
          setSnippet(substitute(snippet, variables));
        }
      },
    );
  }, [method, url, body, headersList, lang, variables]);

  return snippet;
}
