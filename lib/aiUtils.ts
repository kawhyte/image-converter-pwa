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
                      { inlineData: { mimeType: file.type, data: base64Data } }
                  ]
              }],
          };
          const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
          if (!apiKey) {
              throw new Error("API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment.");
          }
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
          
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              const errorBody = await response.text();
              throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
          }

          const result = await response.json();
          const text = result.candidates[0].content.parts[0].text;
          const sanitizedName = text.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
          resolve(sanitizedName);
        } catch (err) {
            reject(err);
        }
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
  });
}