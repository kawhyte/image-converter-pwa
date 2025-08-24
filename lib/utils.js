export const presets = {
    whytes_hero: { name: 'Blog Hero (The Whytes)', quality: 0.85, maxWidth: 1600, description: "For the top hero image on the blog." },
    whytes_gallery: { name: 'Blog Gallery (The Whytes)', quality: 0.78, maxWidth: 1200, description: "For images in the photo gallery section." },
    original: { name: 'Original Quality (No Resize)', quality: 0.95, maxWidth: null, description: "High quality, keeps original dimensions." },
    hero: { name: 'Web Hero (1920px wide)', quality: 0.80, maxWidth: 1920, description: "For large banners and hero sections." },
    photo_gallery: { name: 'Photo Gallery (1600px wide)', quality: 0.80, maxWidth: 1600, description: "For crisp images in a lightbox or portfolio view." },
    standard: { name: 'Standard Web Image (1200px wide)', quality: 0.75, maxWidth: 1200, description: "Best for blog posts and content images." },
    thumbnail: { name: 'Gallery Thumbnail (400px wide)', quality: 0.70, maxWidth: 400, description: "For fast-loading image galleries." },
    custom: { name: 'Custom', quality: 0.75, maxWidth: null, description: "Manually set quality and dimensions." },
};

export const aspectRatios = {
    '1:1': { ratio: 1 / 1, tip: 'Perfect square, great for profile pictures and Instagram posts.' },
    '3:2': { ratio: 3 / 2, tip: 'Classic photography ratio from 35mm film.' },
    '4:3': { ratio: 4 / 3, tip: 'Standard for digital cameras and monitors.' },
    '16:9': { ratio: 16 / 9, tip: 'Widescreen, ideal for hero images and video thumbnails.' },
    '9:16': { ratio: 9 / 16, tip: 'Vertical format for social media stories (Instagram, TikTok).' },
};

export const themes = ['playful', 'dark'];

export const convertFileToWebP = (file, qualityValue, resizeOptions, isPreview = false) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              let { width, height } = img;

              if (resizeOptions.width && resizeOptions.height) {
                  width = parseInt(resizeOptions.width, 10);
                  height = parseInt(resizeOptions.height, 10);
              } else if (resizeOptions.maxWidth && img.width > resizeOptions.maxWidth) {
                  const ratio = resizeOptions.maxWidth / img.width;
                  width = resizeOptions.maxWidth;
                  height = img.height * ratio;
              }

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              const webpDataUrl = canvas.toDataURL('image/webp', parseFloat(qualityValue));
              const convertedSize = Math.round((webpDataUrl.length * 3) / 4);
              resolve({ originalName: file.name, originalSize: file.size, webpDataUrl: isPreview ? null : webpDataUrl, convertedSize });
          };
          img.onerror = () => reject(new Error(`Could not load image: ${file.name}`));
      };
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
  });
};

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};