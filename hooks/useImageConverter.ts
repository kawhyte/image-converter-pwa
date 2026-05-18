import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { presets, getResizeOptions, calculateAspectRatioDimensions } from '../lib/utils';
import { convertFileToWebP, WebPConversionResult } from '../lib/imageUtils';
import { renameWithAi } from '../lib/aiUtils';

const MAX_FILE_SIZE_MB = 30;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const DEFAULT_PRESET = 'hotel_food_cover';

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
  const [files, setFiles] = useState<File[]>([]);
  const [originalDimensions, setOriginalDimensions] = useState<OriginalDimensions | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<string>(DEFAULT_PRESET);
  const [quality, setQuality] = useState<number>(presets[DEFAULT_PRESET].quality);
  const [customWidth, setCustomWidth] = useState<number | ''>('');
  const [customHeight, setCustomHeight] = useState<number | ''>('');

  const [conversionResults, setConversionResults] = useState<ConversionResults>({});
  const [previewResults, setPreviewResults] = useState<ConversionResults>({});

  const [aiFileNames, setAiFileNames] = useState<AiFileNames>({});
  const [isNaming, setIsNaming] = useState<string | null>(null);
  const [namingTimer, setNamingTimer] = useState<number>(0);

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

  const resizeOptions = useMemo(
    () => getResizeOptions(debouncedPreset, debouncedWidth, debouncedHeight),
    [debouncedPreset, debouncedWidth, debouncedHeight]
  );

  const generatePreviews = useCallback(async () => {
    if (previewAbortController.current) {
      previewAbortController.current.abort();
    }
    previewAbortController.current = new AbortController();
    const signal = previewAbortController.current.signal;

    const previewPromises = files.map(file =>
      convertFileToWebP(file, debouncedQuality / 100, resizeOptions, true)
    );

    try {
      const results = await Promise.allSettled(previewPromises);
      if (signal.aborted) return;

      const newPreviewResults: ConversionResults = {};
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          newPreviewResults[result.value.originalName] = result.value;
        } else if (result.status === 'rejected') {
          console.error(`Preview failed for ${files[index].name}:`, result.reason);
        }
      });

      setPreviewResults(newPreviewResults);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Preview generation error:', err);
      }
    }
  }, [files, debouncedQuality, resizeOptions]);

  useEffect(() => {
    if (files.length === 0) {
      setPreviewResults({});
      return;
    }
    generatePreviews();
  }, [files.length, generatePreviews]);

  useEffect(() => {
    return () => {
      if (previewAbortController.current) {
        previewAbortController.current.abort();
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const handlePresetSelect = useCallback((presetKey: string) => {
    setSelectedPreset(presetKey);
    setQuality(presets[presetKey].quality);
    setConversionResults({});
    setDownloadReady(false);
  }, []);

  const handleQualitySliderChange = (values: number[]) => {
    if (selectedPreset !== 'custom') return;
    setQuality(values[0]);
    setConversionResults({});
    setDownloadReady(false);
  };

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter(file =>
      ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'].includes(file.type)
    );

    if (validFiles.length === 0 && newFiles.length > 0) {
      setError('No valid image files selected. Supported: JPEG, PNG, GIF, BMP, WebP');
      return;
    }

    const oversizedFiles = validFiles.filter(f => f.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      setError(
        `${oversizedFiles.map(f => f.name).join(', ')} exceed${oversizedFiles.length === 1 ? 's' : ''} the ${MAX_FILE_SIZE_MB}MB limit and ${oversizedFiles.length === 1 ? 'was' : 'were'} skipped.`
      );
    }

    const acceptableFiles = validFiles.filter(f => f.size <= MAX_FILE_SIZE_BYTES);

    const firstImage = acceptableFiles[0];
    if (firstImage) {
      const img = new Image();
      const url = URL.createObjectURL(firstImage);
      img.src = url;
      img.onload = () => {
        setCustomWidth(img.width);
        setCustomHeight(img.height);
        setOriginalDimensions({ width: img.width, height: img.height });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
      };
    }

    setFiles(prevFiles => {
      const existingFileNames = new Set(prevFiles.map(f => f.name));
      const uniqueNewFiles = acceptableFiles.filter(f => !existingFileNames.has(f.name));
      return [...prevFiles, ...uniqueNewFiles];
    });

    if (oversizedFiles.length === 0) setError('');
    setDownloadReady(false);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    const newWidth = isNaN(raw) ? '' : Math.max(1, Math.min(raw, 8000));
    setCustomWidth(newWidth);
    if (originalDimensions && typeof newWidth === 'number') {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setCustomHeight(Math.max(1, Math.round(newWidth / aspectRatio)));
    }
    setDownloadReady(false);
    setConversionResults({});
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    const newHeight = isNaN(raw) ? '' : Math.max(1, Math.min(raw, 8000));
    setCustomHeight(newHeight);
    if (originalDimensions && typeof newHeight === 'number') {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setCustomWidth(Math.max(1, Math.round(newHeight * aspectRatio)));
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
    setFiles([]);
    setConversionResults({});
    setPreviewResults({});
    setSelectedPreset(DEFAULT_PRESET);
    setQuality(presets[DEFAULT_PRESET].quality);
    setDownloadReady(false);
    setConversionProgress(0);
    setCustomWidth('');
    setCustomHeight('');
    setOriginalDimensions(null);
    setAiFileNames({});
    setIsNaming(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBulkConvert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    setDownloadReady(false);
    setError('');
    setConversionProgress(0);

    const opts = getResizeOptions(selectedPreset, customWidth, customHeight);
    const newResults: ConversionResults = {};

    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      setConvertingFile(currentFile.name);
      try {
        const result = await convertFileToWebP(currentFile, quality / 100, opts);
        newResults[result.originalName] = result;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Conversion failed';
        console.error(msg);
        setError(prev => (prev ? `${prev}\n${msg}` : msg));
      }
      setConversionProgress(((i + 1) / files.length) * 100);
    }

    setConversionResults(newResults);
    setConvertingFile(null);
    setIsConverting(false);
    if (Object.keys(newResults).length > 0) setDownloadReady(true);
  };

  const handleDownloadAll = async () => {
    const JSZip = (window as any).JSZip;
    if (!JSZip) {
      setError('Download library not loaded. Please refresh the page.');
      return;
    }
    setIsZipping(true);
    const zip = new JSZip();

    Object.values(conversionResults)
      .filter(r => r && r.webpDataUrl)
      .forEach(result => {
        const aiName = aiFileNames[result.originalName];
        const baseName = aiName
          ? aiName
          : result.originalName.split('.').slice(0, -1).join('.');
        const ext = result.outputFormat === 'png' ? 'png' : 'webp';
        const newFileName = `${baseName}.${ext}`;
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
      setError('Failed to create zip file.');
      console.error(e);
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
      console.error('AI rename failed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to generate AI name.';
      setError(msg);
    } finally {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsNaming(null);
    }
  };

  const allFilesConverted = useMemo(
    () => files.length > 0 && downloadReady && Object.keys(conversionResults).length > 0,
    [files.length, downloadReady, conversionResults]
  );

  const currentPreset = presets[selectedPreset];

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
    currentPreset,
    addFiles,
    handlePresetSelect,
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
