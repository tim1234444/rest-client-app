'use client';

import { useState } from 'react';
import { fetchFrom } from '@/src/app/API/writeRow/writeRow';

export default function RestClient() {
  const [url, setUrl] = useState('');
  return (
    <form action={fetchFrom} className="flex-col">
      <label htmlFor="method">
        <input type="text" id="method" placeholder="METHOD" />
        <button type="button">Add</button>
      </label>
      <label htmlFor="url">
        <input
          type="text"
          id="url"
          placeholder="URL"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
        />
        <button type="button">Add</button>
      </label>
      <label htmlFor="headers">
        <input type="text" id="headers" placeholder="headers" />
        <button type="button">Add</button>
      </label>
      <label htmlFor="body">
        <textarea name="body" id="body" placeholder="BODY PAYLOAD"></textarea>
        <button type="button">Add</button>
      </label>
      <button type="submit">GO</button>
    </form>
  );
}
