export async function sendRequest(data: { method: string; url: string; headers: Record<string, string>; body: string }) {
    const res = await fetch('/API/writeRow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    return res.json().then(info => ({ status: res.status, data: info }));
  }
  