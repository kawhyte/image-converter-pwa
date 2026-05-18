import type { ResizeOptions, OutputFormat } from './utils';

export interface WebPConversionResult {
  originalName: string;
  webpDataUrl: string;
  outputFormat: OutputFormat;
  originalSize: number;
  webpSize: number;
  reduction: number;
  outputWidth: number;
  outputHeight: number;
}

export function convertFileToWebP(
  file: File,
  quality: number,
  resizeOptions: ResizeOptions,
  _isPreview: boolean = false
): Promise<WebPConversionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      let canvasW: number;
      let canvasH: number;
      let srcX = 0;
      let srcY = 0;
      let srcW = img.width;
      let srcH = img.height;

      if (
        resizeOptions.cropMode === 'exact' &&
        resizeOptions.targetWidth &&
        resizeOptions.targetHeight
      ) {
        canvasW = resizeOptions.targetWidth;
        canvasH = resizeOptions.targetHeight;
        const targetRatio = canvasW / canvasH;
        const srcRatio = img.width / img.height;

        if (srcRatio > targetRatio) {
          // Source is wider than target — crop the width, use full height
          srcH = img.height;
          srcW = Math.round(img.height * targetRatio);
          srcX = Math.round((img.width - srcW) / 2);
          srcY = 0;
        } else if (srcRatio < targetRatio) {
          // Source is taller than target — crop the height, use full width
          srcW = img.width;
          srcH = Math.round(img.width / targetRatio);
          srcX = 0;
          srcY = Math.round((img.height - srcH) / 2);
        }
      } else if (resizeOptions.cropMode === 'resize' && resizeOptions.maxEdge) {
        const maxEdge = resizeOptions.maxEdge;
        if (img.width >= img.height) {
          canvasW = Math.min(img.width, maxEdge);
          canvasH = Math.round(img.height * (canvasW / img.width));
        } else {
          canvasH = Math.min(img.height, maxEdge);
          canvasW = Math.round(img.width * (canvasH / img.height));
        }
      } else {
        // custom mode — use provided dimensions or fall back to original
        canvasW =
          resizeOptions.customWidth && resizeOptions.customWidth > 0
            ? resizeOptions.customWidth
            : img.width;
        canvasH =
          resizeOptions.customHeight && resizeOptions.customHeight > 0
            ? resizeOptions.customHeight
            : img.height;
      }

      canvas.width = canvasW;
      canvas.height = canvasH;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvasW, canvasH);

      const outputFormat = resizeOptions.outputFormat ?? 'webp';
      const mimeType = outputFormat === 'png' ? 'image/png' : 'image/webp';

      const originalName = file.name;
      const originalSize = file.size;
      const finalW = canvasW;
      const finalH = canvasH;

      // Use toBlob + FileReader instead of fetch(dataUrl) — avoids CSP connect-src restrictions
      canvas.toBlob((blob) => {
        canvas.width = 0;
        canvas.height = 0;

        if (!blob) {
          reject(new Error('Failed to encode image'));
          return;
        }

        const webpSize = blob.size;
        const reduction =
          originalSize > 0 ? ((originalSize - webpSize) / originalSize) * 100 : 0;

        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            originalName,
            webpDataUrl: reader.result as string,
            outputFormat,
            originalSize,
            webpSize,
            reduction,
            outputWidth: finalW,
            outputHeight: finalH,
          });
        };
        reader.onerror = () => reject(new Error('Failed to read image data'));
        reader.readAsDataURL(blob);
      }, mimeType, outputFormat !== 'png' ? quality : undefined);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
  });
}
