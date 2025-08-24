import React, { useState, useRef, useCallback, useEffect } from 'react';

// --- Custom Hook for Debouncing ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Helper components (These could be in their own files in a larger app)
const Card = ({ className, ...props }) => <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`} {...props} />;
const CardHeader = ({ className, ...props }) => <div className={`relative flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
const CardTitle = ({ className, ...props }) => <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />;
const CardDescription = ({ className, ...props }) => <p className={`text-sm text-muted-foreground ${className}`} {...props} />;
const CardContent = ({ className, ...props }) => <div className={`p-6 pt-0 ${className}`} {...props} />;
const Button = ({ className, variant = 'default', size = 'default', ...props }) => {
  const variants = { default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90', destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90', outline: 'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground', secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80', ghost: 'hover:bg-accent hover:text-accent-foreground', link: 'text-primary underline-offset-4 hover:underline' };
  const sizes = { default: 'h-9 px-4 py-2', sm: 'h-8 rounded-md px-3 text-xs', lg: 'h-10 rounded-md px-8', icon: 'h-9 w-9' };
  return <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};
const Input = React.forwardRef(({ className, ...props }, ref) => <input className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`} ref={ref} {...props} />);
const Label = ({ className, ...props }) => <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />;
const Slider = ({ className, ...props }) => <input type="range" className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 ${className}`} {...props} />;
const Select = ({ className, children, ...props }) => (
    <div className="relative w-full">
        <select className={`appearance-none h-9 w-full rounded-md border border-input bg-transparent pl-3 pr-8 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></div>
    </div>
);
const ProgressBar = ({ progress }) => (
    <div className="w-full bg-muted rounded-full h-2.5 mb-4">
        <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
    </div>
);
const Tooltip = ({ children, text, className }) => (
    <div className={`tooltip ${className || ''}`}>
        {children}
        <span className="tooltiptext">{text}</span>
    </div>
);

// --- PRESET CONFIGURATION ---
const presets = {
    whytes_hero: { name: 'Blog Hero (The Whytes)', quality: 0.85, maxWidth: 1600, description: "For the top hero image on the blog." },
    whytes_gallery: { name: 'Blog Gallery (The Whytes)', quality: 0.78, maxWidth: 1200, description: "For images in the photo gallery section." },
    original: { name: 'Original Quality (No Resize)', quality: 0.95, maxWidth: null, description: "High quality, keeps original dimensions." },
    hero: { name: 'Web Hero (1920px wide)', quality: 0.80, maxWidth: 1920, description: "For large banners and hero sections." },
    photo_gallery: { name: 'Photo Gallery (1600px wide)', quality: 0.80, maxWidth: 1600, description: "For crisp images in a lightbox or portfolio view." },
    standard: { name: 'Standard Web Image (1200px wide)', quality: 0.75, maxWidth: 1200, description: "Best for blog posts and content images." },
    thumbnail: { name: 'Gallery Thumbnail (400px wide)', quality: 0.70, maxWidth: 400, description: "For fast-loading image galleries." },
    custom: { name: 'Custom', quality: 0.75, maxWidth: null, description: "Manually set quality and dimensions." },
};

const aspectRatios = {
    '1:1': { ratio: 1 / 1, tip: 'Perfect square, great for profile pictures and Instagram posts.' },
    '3:2': { ratio: 3 / 2, tip: 'Classic photography ratio from 35mm film.' },
    '4:3': { ratio: 4 / 3, tip: 'Standard for digital cameras and monitors.' },
    '16:9': { ratio: 16 / 9, tip: 'Widescreen, ideal for hero images and video thumbnails.' },
    '9:16': { ratio: 9 / 16, tip: 'Vertical format for social media stories (Instagram, TikTok).' },
};

const themes = ['playful', 'dark'];

// Main App Component
export function App() {
  const [files, setFiles] = useState([]);
  const [aiFileNames, setAiFileNames] = useState({});
  const [isNaming, setIsNaming] = useState(null);
  const [namingTimer, setNamingTimer] = useState(0);
  const [conversionResults, setConversionResults] = useState({});
  const [previewResults, setPreviewResults] = useState({});
  const [selectedPreset, setSelectedPreset] = useState('whytes_hero');
  const [quality, setQuality] = useState(presets.whytes_hero.quality);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertingFile, setConvertingFile] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState('');
  const [isZipping, setIsZipping] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);

  const fileInputRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const debouncedQuality = useDebounce(quality, 300);
  const debouncedPreset = useDebounce(selectedPreset, 300);
  const debouncedWidth = useDebounce(customWidth, 300);
  const debouncedHeight = useDebounce(customHeight, 300);
  const theme = themes[themeIndex];

  useEffect(() => { 
    document.documentElement.className = theme; 
  }, [theme]);
  const cycleTheme = () => { setThemeIndex((prevIndex) => (prevIndex + 1) % themes.length); };

  useEffect(() => {
    if (files.length === 0) return;
    const generatePreviews = async () => {
        let resizeOptions = {};
        if (debouncedPreset === 'custom') {
            resizeOptions = { width: debouncedWidth, height: debouncedHeight };
        } else {
            resizeOptions = { maxWidth: presets[debouncedPreset].maxWidth };
        }
        const previewPromises = files.map(file => convertFileToWebP(file, debouncedQuality, resizeOptions, true));
        const results = await Promise.allSettled(previewPromises);
        const newPreviewResults = {};
        results.forEach(result => { if (result.status === 'fulfilled') newPreviewResults[result.value.originalName] = result.value; });
        setPreviewResults(newPreviewResults);
    };
    generatePreviews();
  }, [files, debouncedQuality, debouncedPreset, debouncedWidth, debouncedHeight]);

  const handlePresetChange = (e) => {
    const presetKey = e.target.value;
    setSelectedPreset(presetKey);
    setQuality(presets[presetKey].quality);
    setConversionResults({});
    setDownloadReady(false);
  };
  
  const handleQualitySliderChange = (e) => {
    setQuality(parseFloat(e.target.value));
    setSelectedPreset('custom');
    setConversionResults({});
    setDownloadReady(false);
  }

  const addFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type));
    if (validFiles.length === 0 && newFiles.length > 0) { setError(`No valid image files selected.`); return; }
    
    const firstImage = validFiles[0];
    if (firstImage) {
        const img = new Image();
        img.src = URL.createObjectURL(firstImage);
        img.onload = () => {
            setCustomWidth(img.width);
            setCustomHeight(img.height);
            setOriginalDimensions({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src); // Clean up object URL
        };
    }

    setFiles(prevFiles => {
        const existingFileNames = new Set(prevFiles.map(f => f.name));
        const uniqueNewFiles = validFiles.filter(f => !existingFileNames.has(f.name));
        return [...prevFiles, ...uniqueNewFiles];
    });
    setError('');
    setDownloadReady(false);
  };
  
  const handleWidthChange = (e) => {
      const newWidth = e.target.value;
      setCustomWidth(newWidth);
      if (originalDimensions && newWidth) {
          const aspectRatio = originalDimensions.width / originalDimensions.height;
          setCustomHeight(Math.round(newWidth / aspectRatio));
      }
      setDownloadReady(false);
      setConversionResults({});
  };

  const handleHeightChange = (e) => {
      const newHeight = e.target.value;
      setCustomHeight(newHeight);
      if (originalDimensions && newHeight) {
          const aspectRatio = originalDimensions.width / originalDimensions.height;
          setCustomWidth(Math.round(newHeight * aspectRatio));
      }
      setDownloadReady(false);
      setConversionResults({});
  };
  
  const handleAspectRatioChange = (ratio) => {
      if (originalDimensions) {
          const { width, height } = originalDimensions;
          if (width >= height) { // Landscape or square
              setCustomWidth(width);
              setCustomHeight(Math.round(width / ratio));
          } else { // Portrait
              setCustomHeight(height);
              setCustomWidth(Math.round(height * ratio));
          }
      }
      setDownloadReady(false);
      setConversionResults({});
  };


  const handleFileChange = (e) => { if (e.target.files) addFiles(e.target.files); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    e.currentTarget.classList.remove('border-primary');
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const resetState = () => {
      setFiles([]); setConversionResults({}); setPreviewResults({});
      setSelectedPreset('whytes_hero'); setQuality(presets.whytes_hero.quality);
      setDownloadReady(false); setConversionProgress(0);
      setCustomWidth(''); setCustomHeight(''); setOriginalDimensions(null);
      setAiFileNames({}); setIsNaming(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const convertFileToWebP = (file, qualityValue, resizeOptions, isPreview = false) => {
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
  
  const handleBulkConvert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    setDownloadReady(false);
    setError('');
    setConversionProgress(0);
    
    let resizeOptions = {};
    if (selectedPreset === 'custom') {
        resizeOptions = { width: customWidth, height: customHeight };
    } else {
        resizeOptions = { maxWidth: presets[selectedPreset].maxWidth };
    }

    const newResults = {};
    for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        setConvertingFile(currentFile.name);
        try {
            const result = await convertFileToWebP(currentFile, quality, resizeOptions);
            newResults[result.originalName] = result;
            setConversionResults(prev => ({...prev, ...newResults}));
        } catch (e) {
            console.error(e);
            setError(prevError => `${prevError}\n${e.message}`);
        }
        setConversionProgress(((i + 1) / files.length) * 100);
    }
    
    setConvertingFile(null);
    setIsConverting(false);
    setDownloadReady(true);
  };
  
  const handleDownloadAll = async () => {
    if (!window.JSZip) { setError("JSZip library not loaded."); return; }
    setIsZipping(true);
    const zip = new window.JSZip();
    Object.values(conversionResults).filter(r => r.webpDataUrl).forEach(result => {
        const aiName = aiFileNames[result.originalName];
        const baseName = aiName ? aiName : result.originalName.split('.').slice(0, -1).join('.');
        const newFileName = `${baseName}.webp`;
        const base64Data = result.webpDataUrl.split(',')[1];
        zip.file(newFileName, base64Data, { base64: true });
    });
    try {
        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'converted_images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href); // Clean up
    } catch (e) {
        setError("Failed to create zip file."); console.error(e);
    } finally {
        setIsZipping(false);
    }
  };
  
  const handleAiRename = async (file) => {
      setIsNaming(file.name);
      setNamingTimer(0);
      setError('');
      
      timerIntervalRef.current = setInterval(() => {
          setNamingTimer(prev => prev + 1);
      }, 1000);

      try {
        await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async (event) => {
              try {
                const base64ImageData = event.target.result.split(',')[1];
                const payload = {
                    contents: [{
                        parts: [
                            { text: "Generate a concise, descriptive, SEO-friendly filename for this image in under 30 characters. Use hyphens instead of spaces. Do not include the file extension." },
                            { inlineData: { mimeType: file.type, data: base64ImageData } }
                        ]
                    }],
                };
                const apiKey = "AIzaSyCYUZE714XguV97WKL3I8UlGQgcXvW9PNU"; // API key will be proxied by the environment.
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                
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
                setAiFileNames(prev => ({ ...prev, [file.name]: sanitizedName }));
                resolve();
              } catch (err) {
                  reject(err);
              }
          };
          reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        });
      } catch (err) {
          console.error("AI rename failed:", err);
          setError("Failed to generate AI name. Please try again.");
      } finally {
          clearInterval(timerIntervalRef.current);
          setIsNaming(null);
      }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add('border-primary'); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.remove('border-primary'); };
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };
  
  const getNextThemeIcon = () => {
    switch(theme) {
        case 'playful': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-rotate-12 active:scale-125"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
        case 'dark': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-45 active:scale-125"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="m4.22 4.22 1.42 1.42"/><path d="m18.36 18.36 1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="m4.22 19.78 1.42-1.42"/><path d="m18.36 5.64 1.42-1.42"/></svg>;
        default: return null;
    }
  }

  const allFilesConverted = files.length > 0 && files.every(f => conversionResults[f.name]);

  return (
    <div className="bg-background text-foreground min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto relative">
        {theme === 'playful' && (
            <>
                <svg width="60" height="60" viewBox="0 0 100 100" className="absolute -top-8 -left-10 text-primary -z-10"><path d="M10 50 C 20 20, 40 20, 50 50 S 70 80, 90 50" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/></svg>
                <svg width="40" height="40" viewBox="0 0 24 24" className="absolute -top-5 -right-5 text-primary"><path d="m18 3-3 3 3 3 3-3-3-3Z" stroke="currentColor" fill="currentColor"/><path d="m6 3-3 3 3 3 3-3-3-3Z" stroke="currentColor" fill="currentColor"/></svg>
                <svg width="40" height="40" viewBox="0 0 24 24" className="absolute -bottom-5 -left-5 text-primary"><path d="m18 3-3 3 3 3 3-3-3-3Z" stroke="currentColor" fill="currentColor" transform="translate(0, 18) scale(0.8)"/><path d="m6 3-3 3 3 3 3-3-3-3Z" stroke="currentColor" fill="currentColor" transform="translate(0, 18) scale(0.8)"/></svg>
            </>
        )}
        <Card className={`w-full transition-all duration-300 ${theme === 'playful' ? 'playful-card' : ''}`}>
          <CardHeader>
             <Button onClick={cycleTheme} variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 group">
                {getNextThemeIcon()}
                <span className="sr-only">Cycle theme</span>
            </Button>
            <CardTitle className="text-2xl bg-amber-400">Bulk Image to WebP Converter</CardTitle>
            <CardDescription>Drag and drop images to convert them using powerful, one-click presets.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:border-primary/80"
              onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current.click()}
            >
              <Input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/gif,image/bmp" onChange={handleFileChange} multiple />
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              <p className="text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop files</p>
              <p className="text-xs text-muted-foreground mt-1">Bulk conversion is supported</p>
            </div>

            {error && <p className="text-destructive text-sm mt-4 text-center whitespace-pre-wrap">{error}</p>}

            {files.length > 0 && (
              <div className="mt-6">
                <div className="p-4 border rounded-lg bg-muted/50 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div>
                            <Label htmlFor="preset">Optimization Preset</Label>
                            <Select id="preset" value={selectedPreset} onChange={handlePresetChange}>
                                {Object.entries(presets).map(([key, preset]) => (
                                    <option key={key} value={key}>{preset.name}</option>
                                ))}
                            </Select>
                             <p className="text-xs text-muted-foreground mt-1">{presets[selectedPreset].description}</p>
                        </div>
                        <div>
                            <Label htmlFor="quality">Quality: <span className="font-bold text-primary">{Math.round(quality * 100)}</span></Label>
                            <Slider id="quality" min="0.1" max="1" step="0.01" value={quality} onChange={handleQualitySliderChange} className="w-full" />
                        </div>
                    </div>
                    {selectedPreset === 'custom' && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="width">Width (px)</Label>
                                    <Input type="number" id="width" value={customWidth} onChange={handleWidthChange} />
                                </div>
                                <div>
                                    <Label htmlFor="height">Height (px)</Label>
                                    <Input type="number" id="height" value={customHeight} onChange={handleHeightChange} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(aspectRatios).map(([name, {ratio, tip}]) => (
                                    <Tooltip key={name} text={tip}>
                                        <Button size="sm" variant="outline" onClick={() => handleAspectRatioChange(ratio)} className={`${theme === 'playful' ? 'playful-button' : ''} ${theme === 'dark' ? 'dark-mode-button' : ''}`}>
                                            {name}
                                        </Button>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {isConverting && <ProgressBar progress={conversionProgress} />}

                <div className="space-y-4 max-h-72 file-list-container">
                    {files.map(file => {
                        const result = conversionResults[file.name];
                        const preview = previewResults[file.name];
                        const displaySize = result ? result.convertedSize : (preview ? preview.convertedSize : null);
                        const displayName = aiFileNames[file.name] ? `${aiFileNames[file.name]}.webp` : file.name;
                        const objectUrl = URL.createObjectURL(file);

                        return (
                            <div key={file.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={objectUrl} alt={file.name} className="w-12 h-12 object-cover rounded-md shrink-0" onLoad={() => URL.revokeObjectURL(objectUrl)} />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium truncate">{displayName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(file.size)}
                                            {displaySize !== null && (
                                                <>
                                                    <span className="mx-1">→</span>
                                                    <span className={result ? 'font-bold' : ''}>
                                                        {result ? '' : 'Est. '}{formatBytes(displaySize)}
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {isNaming === file.name && (
                                        <div className="flex items-center justify-center h-8 w-24 text-sm text-green-500 font-semibold tabular-nums">
                                            ✨ {namingTimer}s
                                        </div>
                                    )}
                                    {convertingFile === file.name && !result && (
                                        <div className="flex items-center justify-center h-8 w-24 text-sm text-primary font-semibold">
                                            Converting...
                                        </div>
                                    )}
                                    {isNaming !== file.name && convertingFile !== file.name && (
                                        <>
                                            <Tooltip text="Rename with AI" className="tooltip-left">
                                                <Button size="icon" variant="ghost" onClick={() => handleAiRename(file)} disabled={isNaming !== null} className="h-8 w-8">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="m15 5 3 3"/></svg>
                                                </Button>
                                            </Tooltip>
                                            {result && (
                                                <a href={result.webpDataUrl} download={`${displayName.split('.').slice(0, -1).join('.')}.webp`}>
                                                    <Button size="sm" variant="outline" className={`${theme === 'playful' ? 'playful-button' : ''} ${theme === 'dark' ? 'dark-mode-button' : ''}`}>Save</Button>
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-6 pt-6 border-t flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button onClick={handleBulkConvert} disabled={isConverting || files.length === 0} className={`w-full sm:w-auto grow ${theme === 'playful' ? 'playful-button' : ''} ${theme === 'dark' ? 'dark-mode-button' : ''}`}>
                            {isConverting ? `Converting... ${Math.round(conversionProgress)}%` : `Convert ${files.length} File(s)`}
                        </Button>
                        {allFilesConverted && (
                            <Button
                                onClick={handleDownloadAll}
                                disabled={isZipping}
                                variant="secondary"
                                className={`w-full sm:w-auto grow relative ${theme === 'playful' ? 'playful-button' : ''} ${theme === 'dark' ? 'dark-mode-button' : ''} ${downloadReady ? 'animated-download-ready' : ''}`}
                            >
                                <div className="button-inner-bg"></div>
                                <span>{isZipping ? 'Zipping...' : 'Download All (.zip)'}</span>
                            </Button>
                        )}
                    </div>
                    <Button onClick={resetState} variant="outline" size="sm" className={`w-full max-w-xs ${theme === 'playful' ? 'playful-button' : ''} ${theme === 'dark' ? 'dark-mode-button' : ''}`}>Clear All</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
