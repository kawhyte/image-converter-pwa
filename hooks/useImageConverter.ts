import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { presets, getResizeOptions, calculateAspectRatioDimensions } from '../lib/utils';
import { convertFileToWebP, WebPConversionResult } from '../lib/imageUtils';
import { renameWithAi } from '../lib/aiUtils';

// Type Definitions
interface OriginalDimensions {
  width: number;
  height: number;
}

interface AiFileNames {
  [key: string]: string;
}

interface ConversionResults {
    [key: string]: WebPConversionResult;
}

export function useImageConverter() {
  // File management
  const [files, setFiles] = useState<File[]>([]);
  const [originalDimensions, setOriginalDimensions] = useState<OriginalDimensions | null>(null);

  // Conversion settings
  const [selectedPreset, setSelectedPreset] = useState<string>('whytes_hero');
  const [quality, setQuality] = useState<number>(presets.whytes_hero.quality);
  const [customWidth, setCustomWidth] = useState<number | ''>('');
  const [customHeight, setCustomHeight] = useState<number | ''>('');

  // Conversion results
  const [conversionResults, setConversionResults] = useState<ConversionResults>({});
  const [previewResults, setPreviewResults] = useState<ConversionResults>({});

  // AI naming
  const [aiFileNames, setAiFileNames] = useState<AiFileNames>({});
  const [isNaming, setIsNaming] = useState<string | null>(null);
  const [namingTimer, setNamingTimer] = useState<number>(0);

  // Processing states
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [convertingFile, setConvertingFile] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previewAbortController = useRef<AbortController | null>(null);

  const debouncedPreset = useDebounce(selectedPreset, 300);
  const debouncedWidth = useDebounce(customWidth, 300);
  const debouncedHeight = useDebounce(customHeight, 300);
  const debouncedQuality = useDebounce(quality, 300);

  // Memoize resize options to prevent unnecessary recalculations
  const resizeOptions = useMemo(() =>
    getResizeOptions(debouncedPreset, debouncedWidth, debouncedHeight),
    [debouncedPreset, debouncedWidth, debouncedHeight]
  );

  // Memoized preview generation function
  const generatePreviews = useCallback(async () => {
    // Cancel any existing preview generation
    if (previewAbortController.current) {
      previewAbortController.current.abort();
    }
    previewAbortController.current = new AbortController();

    const previewPromises = files.map(file => {
        return convertFileToWebP(file, debouncedQuality / 100, resizeOptions, true);
    });

    try {
        const results = await Promise.allSettled(previewPromises);
        const newPreviewResults: ConversionResults = {};

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                newPreviewResults[result.value.originalName] = result.value;
            } else if (result.status === 'rejected') {
                console.error(`Preview failed for ${files[index].name}:`, result.reason);
            }
        });

        setPreviewResults(newPreviewResults);
    } catch (error) {
        // Handle cancellation gracefully
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Preview generation error:', error);
        }
    }
  }, [files, debouncedQuality, resizeOptions]);

  useEffect(() => {
    if (files.length === 0) {
        setPreviewResults({});
        return;
    }

    generatePreviews();
  }, [generatePreviews]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending preview generation
      if (previewAbortController.current) {
        previewAbortController.current.abort();
      }
      // Clear any pending timers
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const handlePresetChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetKey = e.target.value;
    setSelectedPreset(presetKey);
    setQuality(presets[presetKey].quality);
    setConversionResults({});
    setDownloadReady(false);
  }, []);
  
  const handleQualitySliderChange = (values: number[]) => {
    if (selectedPreset !== 'custom') {
      return; // Do nothing if not in custom mode
    }

    setQuality(values[0]);
    setConversionResults({});
    setDownloadReady(false);

    // Force preview regeneration for immediate feedback
    if (files.length > 0) {
      const forcePreviewUpdate = async () => {
        const resizeOptions = getResizeOptions('custom', customWidth, customHeight);

        const previewPromises = files.map(file =>
          convertFileToWebP(file, values[0] / 100, resizeOptions, true)
        );
        const results = await Promise.allSettled(previewPromises);
        const newPreviewResults: ConversionResults = {};

        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            newPreviewResults[result.value.originalName] = result.value;
          } else if (result.status === 'rejected') {
            console.error(`Force preview failed for ${files[index].name}:`, result.reason);
          }
        });

        setPreviewResults(newPreviewResults);
      };

      // Small delay to avoid overwhelming the system during rapid slider movement
      setTimeout(forcePreviewUpdate, 50);
    }
  };

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
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
            URL.revokeObjectURL(img.src);
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
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newWidth = parseInt(e.target.value, 10);
      setCustomWidth(isNaN(newWidth) ? '' : newWidth);
      if (originalDimensions && newWidth) {
          const aspectRatio = originalDimensions.width / originalDimensions.height;
          setCustomHeight(Math.round(newWidth / aspectRatio));
      }
      setDownloadReady(false);
      setConversionResults({});
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHeight = parseInt(e.target.value, 10);
      setCustomHeight(isNaN(newHeight) ? '' : newHeight);
      if (originalDimensions && newHeight) {
          const aspectRatio = originalDimensions.width / originalDimensions.height;
          setCustomWidth(Math.round(newHeight * aspectRatio));
      }
      setDownloadReady(false);
      setConversionResults({});
  };
  
  const handleAspectRatioChange = (ratio: number) => {
      if (originalDimensions) {
          const newDimensions = calculateAspectRatioDimensions(originalDimensions, ratio);
          setCustomWidth(newDimensions.width);
          setCustomHeight(newDimensions.height);
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

    const resizeOptions = getResizeOptions(selectedPreset, customWidth, customHeight);

    const newResults: ConversionResults = {};
    for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        setConvertingFile(currentFile.name);
        try {
            const result = await convertFileToWebP(currentFile, quality / 100, resizeOptions);
            newResults[result.originalName] = result;
            setConversionResults(prev => ({...prev, ...newResults}));
        } catch (e: any) {
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
    const JSZip = (window as any).JSZip;
    if (!JSZip) {
      setError("JSZip library not loaded.");
      return;
    }
    setIsZipping(true);
    const zip = new JSZip();
    Object.values(conversionResults).filter(r => r && r.webpDataUrl).forEach(result => {
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
        URL.revokeObjectURL(link.href);
    } catch (e) {
        setError("Failed to create zip file."); console.error(e);
    } finally {
        setIsZipping(false);
    }
  };
  
  const handleAiRename = async (file: File) => {
      setIsNaming(file.name);
      setNamingTimer(0);
      setError('');

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
          setNamingTimer(prev => prev + 1);
      }, 1000);

      try {
        const sanitizedName = await renameWithAi(file);
        setAiFileNames(prev => ({ ...prev, [file.name]: sanitizedName }));
      } catch (err) {
          console.error("AI rename failed:", err);
          setError("Failed to generate AI name. Please try again.");
      } finally {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setIsNaming(null);
      }
  };

  const allFilesConverted = useMemo(() =>
    files.length > 0 && files.every(f => conversionResults[f.name]),
    [files, conversionResults]
  );

  return {
    files,
    aiFileNames,
    isNaming,
    namingTimer,
    conversionResults,
    previewResults,
    selectedPreset,
    quality,
    customWidth,
    customHeight,
    isConverting,
    conversionProgress,
    convertingFile,
    downloadReady,
    error,
    isZipping,
    fileInputRef,
    addFiles,
    handlePresetChange,
    handleQualitySliderChange,
    handleWidthChange,
    handleHeightChange,
    handleAspectRatioChange,
    resetState,
    handleBulkConvert,
    handleDownloadAll,
    handleAiRename,
    allFilesConverted,
  };
}
