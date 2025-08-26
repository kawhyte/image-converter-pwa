import { useState } from 'react';
import { convertFileToWebP, WebPConversionResult } from '../lib/imageUtils';
import { presets } from '../lib/utils';

interface ConversionResults {
    [key: string]: WebPConversionResult;
}

interface AiFileNames {
  [key: string]: string;
}

export function useImageProcessing(
    files: File[], 
    quality: number, 
    selectedPreset: string, 
    customWidth: number | '', 
    customHeight: number | '', 
    aiFileNames: AiFileNames
) {
    const [conversionResults, setConversionResults] = useState<ConversionResults>({});
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [conversionProgress, setConversionProgress] = useState<number>(0);
    const [convertingFile, setConvertingFile] = useState<string | null>(null);
    const [downloadReady, setDownloadReady] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isZipping, setIsZipping] = useState<boolean>(false);

    const handleBulkConvert = async () => {
        if (files.length === 0) return;
        setIsConverting(true);
        setDownloadReady(false);
        setError('');
        setConversionProgress(0);

        let resizeOptions: { width?: number | ''; height?: number | ''; maxWidth?: number } = {};
        if (selectedPreset === 'custom') {
            resizeOptions = { width: customWidth, height: customHeight };
        } else {
            resizeOptions = { maxWidth: presets[selectedPreset]?.maxWidth ?? undefined };
        }

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
        if (!JSZip) { setError("JSZip library not loaded."); return; }
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
    
    const resetProcessing = () => {
        setConversionResults({});
        setDownloadReady(false);
        setConversionProgress(0);
    }

    return {
        conversionResults,
        setConversionResults,
        isConverting,
        conversionProgress,
        convertingFile,
        downloadReady,
        setDownloadReady,
        error,
        setError,
        isZipping,
        handleBulkConvert,
        handleDownloadAll,
        resetProcessing,
    };
}
