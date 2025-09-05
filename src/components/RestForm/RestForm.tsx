'use client';

import { useEffect, useState } from 'react';

const fetchFrom =  async function F(formdata: FormData) {
  console.log(formdata);
  await fetch('http://localhost:3000/API/writeRow', {
    method: 'POST',
    body: JSON.stringify({
      method:  formdata.get('method'),
      url: formdata.get('url'),
      headers: formdata.get('headers'),
      body: formdata.get('body'),
    })
  })
}

export default function RestClient() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('');
  useEffect(() => {

  }, [url, setUrl, method, setMethod]);
  return (
    <form action={fetchFrom} className="flex flex-col gap-1">
      <label htmlFor="method">
        <select name="method" id="method"
        onChange={(e) => {
          setMethod(e.target.value)
        }}>
          <option type="text" id="method" placeholder="METHOD" />
          <option value="POST">POST</option>
          <option value="POST">GET</option>
        </select>
        <button type="button">Add</button>
      </label>
      <label htmlFor="url">
        <input
          type="text"
          id="url"
          name='url'
          placeholder="URL"
        />
        <button type="button">Add</button>
      </label>
      <label htmlFor="headers">
        <input type="text" name='headers' id="headers" placeholder="headers" />
        <button type="button">Add</button>
      </label>
      <label htmlFor="body">
        <textarea name="body" id="body" placeholder="BODY PAYLOAD"></textarea>
        <button type="button">Add</button>
      </label>
      <button type="submit">submit</button>
    </form>
  );
}
