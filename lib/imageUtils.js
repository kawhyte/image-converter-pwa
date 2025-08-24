export function convertFileToWebP(file, quality, resizeOptions, isPreview) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let { width, height } = img;
      if (resizeOptions) {
        if (resizeOptions.maxWidth && width > resizeOptions.maxWidth) {
          height = (resizeOptions.maxWidth / width) * height;
          width = resizeOptions.maxWidth;
        }
        if (resizeOptions.width) {
            width = parseInt(resizeOptions.width, 10);
        }
        if (resizeOptions.height) {
            height = parseInt(resizeOptions.height, 10);
        }
      }
      
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const webpDataUrl = canvas.toDataURL('image/webp', quality);
      
      const originalName = file.name;
      
      // Create a blob to get the size
      fetch(webpDataUrl)
        .then(res => res.blob())
        .then(blob => {
            resolve({
                originalName,
                webpDataUrl,
                convertedSize: blob.size,
            });
        });
    };
    img.onerror = (err) => {
      reject(err);
    };
  });
}