export interface WebPConversionResult {
  originalName: string;
  webpDataUrl: string;
  originalSize: number;
  webpSize: number;
  reduction: number;
}

interface ResizeOptions {
  maxWidth?: number;
  width?: number | '';
  height?: number | '';
}

export function convertFileToWebP(
  file: File,
  quality: number,
  resizeOptions: ResizeOptions = {},
  isPreview: boolean = false
): Promise<WebPConversionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      let { width, height } = img;

      if (resizeOptions.maxWidth && width > resizeOptions.maxWidth) {
        height = (resizeOptions.maxWidth / width) * height;
        width = resizeOptions.maxWidth;
      }
      
      if (typeof resizeOptions.width === 'number' && resizeOptions.width > 0) {
        width = resizeOptions.width;
      }
      if (typeof resizeOptions.height === 'number' && resizeOptions.height > 0) {
        height = resizeOptions.height;
      }
      
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      // Use the actual quality value for both preview and final conversion
      const webpDataUrl = canvas.toDataURL('image/webp', quality);
      
      const originalName = file.name;
      const originalSize = file.size;
      
      fetch(webpDataUrl)
        .then(res => res.blob())
        .then(blob => {
            const webpSize = blob.size;
            const reduction = originalSize > 0 ? ((originalSize - webpSize) / originalSize) * 100 : 0;
            URL.revokeObjectURL(img.src);
            resolve({
                originalName,
                webpDataUrl,
                originalSize,
                webpSize,
                reduction,
            });
        });
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(img.src);
      reject(err);
    };
  });
}