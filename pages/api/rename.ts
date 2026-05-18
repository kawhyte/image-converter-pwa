import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

type RenameResponse = { name: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RenameResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'AI naming is not configured.' });
  }

  const { base64Data, mimeType } = req.body;
  if (!base64Data || !mimeType) {
    return res.status(400).json({ error: 'Missing image data.' });
  }

  if (typeof base64Data !== 'string' || base64Data.length > 10_000_000) {
    return res.status(400).json({ error: 'Image data too large or invalid.' });
  }

  const payload = {
    contents: [
      {
        parts: [
          {
            text: 'Generate a concise, descriptive, SEO-friendly filename for this image in under 30 characters. Use hyphens instead of spaces. Do not include the file extension. Return only the filename, nothing else.',
          },
          { inline_data: { mime_type: mimeType, data: base64Data } },
        ],
      },
    ],
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (!response) {
    return res.status(502).json({ error: 'Could not reach AI service.' });
  }

  if (!response.ok) {
    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again.' });
    }
    if (response.status === 403) {
      return res.status(500).json({ error: 'AI service key is invalid.' });
    }
    return res.status(502).json({ error: 'AI service error.' });
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return res.status(502).json({ error: 'Unexpected response from AI service.' });
  }

  const name = text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .slice(0, 60);

  return res.status(200).json({ name });
}
