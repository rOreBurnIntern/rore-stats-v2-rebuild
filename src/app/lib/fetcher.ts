const LOCAL_BASE_URL = 'http://localhost:3000';

function getApiUrl(endpoint: string) {
  if (typeof window !== 'undefined') {
    return `/api${endpoint}`;
  }

  const configuredBaseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const baseUrl = configuredBaseUrl ?? vercelUrl ?? LOCAL_BASE_URL;

  return new URL(`/api${endpoint}`, baseUrl).toString();
}

export async function fetchFromAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const requestInit: RequestInit & { next?: { revalidate: number } } = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Revalidate every 30 seconds
      next: { revalidate: 30 },
    };

    const res = await fetch(getApiUrl(endpoint), requestInit);

    if (!res.ok) {
      console.error(`Error fetching ${endpoint}: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Exception fetching ${endpoint}:`, error);
    return null;
  }
}
