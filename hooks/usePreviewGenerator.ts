import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { presets } from '../lib/utils';
import { convertFileToWebP, WebPConversionResult } from '../lib/imageUtils';

interface ConversionResults {
    [key: string]: WebPConversionResult;
}

export function usePreviewGenerator(
    files: File[],
    quality: number,
    selectedPreset: string,
    customWidth: number | '',
    customHeight: number | '',
) {
    const [previewResults, setPreviewResults] = useState<ConversionResults>({});

    const debouncedPreset = useDebounce(selectedPreset, 300);
    const debouncedWidth = useDebounce(customWidth, 300);
    const debouncedHeight = useDebounce(customHeight, 300);
    const debouncedQuality = useDebounce(quality, 300);

    const generatePreviews = useCallback(async (q: number, p: string, w: number | '', h: number | '') => {
        if (files.length === 0) {
            setPreviewResults({});
            return;
        }

        let resizeOptions: { width?: number | ''; height?: number | ''; maxWidth?: number } = {};
        if (p === 'custom') {
            resizeOptions = { width: w, height: h };
        } else {
            resizeOptions = { maxWidth: presets[p]?.maxWidth ?? undefined };
        }

        const previewPromises = files.map(file =>
            convertFileToWebP(file, q / 100, resizeOptions, true)
        );

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
    }, [files]);

    useEffect(() => {
        generatePreviews(debouncedQuality, debouncedPreset, debouncedWidth, debouncedHeight);
    }, [generatePreviews, debouncedQuality, debouncedPreset, debouncedWidth, debouncedHeight]);

    const forcePreviewUpdate = useCallback((newQuality: number) => {
        if (files.length > 0) {
            const update = async () => {
                let resizeOptions: { width?: number | ''; height?: number | ''; maxWidth?: number } = {};
                if (selectedPreset === 'custom') {
                    resizeOptions = { width: customWidth, height: customHeight };
                } else {
                    resizeOptions = { maxWidth: presets[selectedPreset]?.maxWidth ?? undefined };
                }
                
                const previewPromises = files.map(file => convertFileToWebP(file, newQuality / 100, resizeOptions, true));
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
            setTimeout(update, 50);
        }
    }, [files, selectedPreset, customWidth, customHeight]);

    const resetPreviews = () => {
        setPreviewResults({});
    }

    return { previewResults, forcePreviewUpdate, resetPreviews };
}
