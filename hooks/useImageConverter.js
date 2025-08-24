import { useState, useRef, useCallback, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { presets, aspectRatios, formatBytes } from '../lib/utils';
import { convertFileToWebP } from '../lib/imageUtils';
import { renameWithAi } from '../lib/aiUtils';

export function useImageConverter() {
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

  const fileInputRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const debouncedQuality = useDebounce(quality, 300);
  const debouncedPreset = useDebounce(selectedPreset, 300);
  const debouncedWidth = useDebounce(customWidth, 300);
  const debouncedHeight = useDebounce(customHeight, 300);

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
        const sanitizedName = await renameWithAi(file);
        setAiFileNames(prev => ({ ...prev, [file.name]: sanitizedName }));
      } catch (err) {
          console.error("AI rename failed:", err);
          setError("Failed to generate AI name. Please try again.");
      } finally {
          clearInterval(timerIntervalRef.current);
          setIsNaming(null);
      }
  };

  const allFilesConverted = files.length > 0 && files.every(f => conversionResults[f.name]);

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