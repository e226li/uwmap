export async function GET(url: string) {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiKey) {
      throw new Error('API_KEY is not defined');
    }

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
      },

    })
    const data = await res.json()
   
    return data;
}