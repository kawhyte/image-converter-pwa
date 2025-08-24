import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { presets, aspectRatios, themes, convertFileToWebP, formatBytes } from '../lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const Header = ({ theme, cycleTheme }) => {
    const getNextThemeIcon = () => {
        switch(theme) {
            case 'playful': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-rotate-12 active:scale-125"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
            case 'dark': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-45 active:scale-125"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="m4.22 4.22 1.42 1.42"/><path d="m18.36 18.36 1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="m4.22 19.78 1.42-1.42"/><path d="m18.36 5.64 1.42-1.42"/></svg>;
            default: return null;
        }
    }

    return (
        <CardHeader>
            <Button onClick={cycleTheme} variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 group">
                {getNextThemeIcon()}
                <span className="sr-only">Cycle theme</span>
            </Button>
            <CardTitle className="text-2xl bg-amber-400">Bulk Image to WebP Converter</CardTitle>

            <CardDescription>Drag and drop images to convert them using powerful, one-click presets.</CardDescription>
        </CardHeader>
    );
};

const FileUpload = ({ fileInputRef, addFiles }) => {
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        e.currentTarget.classList.remove('border-primary');
        if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add('border-primary'); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.remove('border-primary'); };
    const handleFileChange = (e) => { if (e.target.files) addFiles(e.target.files); };

    return (
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
    );
};

const Settings = ({ selectedPreset, handlePresetChange, quality, handleQualitySliderChange, customWidth, handleWidthChange, customHeight, handleHeightChange, handleAspectRatioChange, theme }) => (
    <div className="p-4 border rounded-lg bg-muted/50 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
                <Label htmlFor="preset">Optimization Preset</Label>
                <Select id="preset" value={selectedPreset} onValueChange={(value) => handlePresetChange({ target: { value } })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(presets).map(([key, preset]) => (
                            <SelectItem key={key} value={key}>{preset.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">{presets[selectedPreset].description}</p>
            </div>
            <div>
                <Label htmlFor="quality">Quality: <span className="font-bold text-primary">{Math.round(quality * 100)}</span></Label>
                <Slider id="quality" min={0.1} max={1} step={0.01} value={[quality]} onValueChange={(value) => handleQualitySliderChange({ target: { value: value[0] } })} className="w-full" />
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
                        <Tooltip key={name}>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => handleAspectRatioChange(ratio)} className={`${theme === 'playful' ? 'playful-button' : ''} ${theme === 'dark' ? 'dark-mode-button' : ''}`}>
                                    {name}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tip}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const FileItem = ({ file, result, preview, aiFileName, isNaming, namingTimer, convertingFile, handleAiRename, theme }) => {
    const displaySize = result ? result.convertedSize : (preview ? preview.convertedSize : null);
    const displayName = aiFileName ? `${aiFileName}.webp` : file.name;
    const objectUrl = URL.createObjectURL(file);

    return (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
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
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" onClick={() => handleAiRename(file)} disabled={isNaming !== null} className="h-8 w-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="m15 5 3 3"/></svg>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Rename with AI</p>
                            </TooltipContent>
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
    );
};

const FileList = ({ files, conversionResults, previewResults, aiFileNames, isNaming, namingTimer, convertingFile, handleAiRename, theme }) => (
    <div className="space-y-4 max-h-72 file-list-container">
        {files.map(file => (
            <FileItem
                key={file.name}
                file={file}
                result={conversionResults[file.name]}
                preview={previewResults[file.name]}
                aiFileName={aiFileNames[file.name]}
                isNaming={isNaming}
                namingTimer={namingTimer}
                convertingFile={convertingFile}
                handleAiRename={handleAiRename}
                theme={theme}
            />
        ))}
    </div>
);

const Actions = ({ handleBulkConvert, isConverting, files, conversionProgress, allFilesConverted, handleDownloadAll, isZipping, downloadReady, resetState, theme }) => (
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
                    className={`w-full sm:w-auto grow relative ${theme === 'playful' ? 'playful-button' : ''} ${theme === 'dark' ? 'dark-mode-button' : ''} ${downloadReady ? 'animated-download-ready' : ''}`}>
                    <div className="button-inner-bg"></div>
                    <span>{isZipping ? 'Zipping...' : 'Download All (.zip)'}</span>
                </Button>
            )}
        </div>
        <Button onClick={resetState} variant="outline" size="sm" className={`w-full max-w-xs ${theme === 'playful' ? 'playful-button' : ''} ${theme === 'dark' ? 'dark-mode-button' : ''}`}>Clear All</Button>
    </div>
);

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

  const resetState = () => {
      setFiles([]); setConversionResults({}); setPreviewResults({});
      setSelectedPreset('whytes_hero'); setQuality(presets.whytes_hero.quality);
      setDownloadReady(false); setConversionProgress(0);
      setCustomWidth(''); setCustomHeight(''); setOriginalDimensions(null);
      setAiFileNames({}); setIsNaming(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
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
            setError(prevError => `${prevError}
${e.message}`);
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
                const base64Data = event.target.result.split(',')[1];
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

  const allFilesConverted = files.length > 0 && files.every(f => conversionResults[f.name]);

  return (
    <TooltipProvider>
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
            <Header theme={theme} cycleTheme={cycleTheme} />
            <CardContent>
              <FileUpload fileInputRef={fileInputRef} addFiles={addFiles} />

              {error && <p className="text-destructive text-sm mt-4 text-center whitespace-pre-wrap">{error}</p>}

              {files.length > 0 && (
                <div className="mt-6">
                  <Settings
                      selectedPreset={selectedPreset}
                      handlePresetChange={handlePresetChange}
                      quality={quality}
                      handleQualitySliderChange={handleQualitySliderChange}
                      customWidth={customWidth}
                      handleWidthChange={handleWidthChange}
                      customHeight={customHeight}
                      handleHeightChange={handleHeightChange}
                      handleAspectRatioChange={handleAspectRatioChange}
                      theme={theme}
                  />

                  {isConverting && <Progress value={conversionProgress} />}

                  <FileList
                      files={files}
                      conversionResults={conversionResults}
                      previewResults={previewResults}
                      aiFileNames={aiFileNames}
                      isNaming={isNaming}
                      namingTimer={namingTimer}
                      convertingFile={convertingFile}
                      handleAiRename={handleAiRename}
                      theme={theme}
                  />
                  <Actions
                      handleBulkConvert={handleBulkConvert}
                      isConverting={isConverting}
                      files={files}
                      conversionProgress={conversionProgress}
                      allFilesConverted={allFilesConverted}
                      handleDownloadAll={handleDownloadAll}
                      isZipping={isZipping}
                      downloadReady={downloadReady}
                      resetState={resetState}
                      theme={theme}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}