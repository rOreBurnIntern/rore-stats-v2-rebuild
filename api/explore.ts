import { getExploreProxyResponse } from '../src/app/api/explore/proxy';

interface VercelApiRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}

interface VercelApiResponse {
  json(body: unknown): unknown;
  setHeader(name: string, value: string): void;
  status(statusCode: number): VercelApiResponse;
}

const METHOD_NOT_ALLOWED_RESPONSE = { error: 'Method not allowed' };

export default async function handler(req: VercelApiRequest, res: VercelApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json(METHOD_NOT_ALLOWED_RESPONSE);
  }

  const { body, status } = await getExploreProxyResponse(req.query);
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}
