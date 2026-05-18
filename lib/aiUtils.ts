export async function renameWithAi(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      try {
        if (!event.target?.result) {
          return reject(new Error('File reading failed.'));
        }

        const base64Data = (event.target.result as string).split(',')[1];

        const response = await fetch('/api/rename', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data, mimeType: file.type }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({ error: 'Unknown error' }));
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a moment.');
          }
          throw new Error(body.error ?? `Request failed (${response.status})`);
        }

        const { name } = await response.json();
        if (!name) throw new Error('Invalid response from AI service.');

        resolve(name);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
  });
}
