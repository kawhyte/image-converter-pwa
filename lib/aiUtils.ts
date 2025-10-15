export async function renameWithAi(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          if (!event.target?.result) {
            return reject(new Error("File reading failed."));
          }
          const base64Data = (event.target.result as string).split(',')[1];
          const payload = {
              contents: [{
                  parts: [
                      { text: "Generate a concise, descriptive, SEO-friendly filename for this image in under 30 characters. Use hyphens instead of spaces. Do not include the file extension." },
                      { inline_data: { mime_type: file.type, data: base64Data } }
                  ]
              }],
          };
          const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

          // Enhanced error handling with specific messages
          if (!apiKey) {
              console.error('❌ Gemini API key not found. Please check:');
              console.error('1. .env.local file exists with NEXT_PUBLIC_GEMINI_API_KEY');
              console.error('2. Dev server was restarted after adding .env.local');
              throw new Error("API key not configured. Restart dev server and try again.");
          }

          console.log('✓ API key found, making request to Gemini...');
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              const errorBody = await response.text();
              console.error('❌ Gemini API Error:', {
                  status: response.status,
                  statusText: response.statusText,
                  body: errorBody
              });

              // Provide helpful error messages
              if (response.status === 400) {
                  throw new Error('Invalid API request. Check image format and size.');
              } else if (response.status === 403) {
                  throw new Error('API key is invalid or expired. Please check your key.');
              } else if (response.status === 429) {
                  throw new Error('Rate limit exceeded. Please try again in a moment.');
              } else {
                  throw new Error(`API error (${response.status}): ${errorBody}`);
              }
          }

          const result = await response.json();
          console.log('✓ Gemini API response received:', result);

          // Validate response structure
          if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
              console.error('❌ Unexpected API response structure:', result);
              throw new Error('Invalid response from Gemini API');
          }

          const text = result.candidates[0].content.parts[0].text;
          const sanitizedName = text.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
          console.log('✓ Generated filename:', sanitizedName);
          resolve(sanitizedName);
        } catch (err) {
            reject(err);
        }
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
  });
}