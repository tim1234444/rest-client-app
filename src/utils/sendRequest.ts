export async function sendRequest(data: {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
}) {
  const res = await fetch(`/API/writeRow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  console.log('CONSOLE',res);
  const json = await res.json();
  console.log('CONSOLE2', { status: res.status, data: json });
  return { status: res.status, data: json };
}
