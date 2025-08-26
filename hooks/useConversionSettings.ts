
import { useState } from 'react';
import { presets } from '../lib/utils';

interface OriginalDimensions {
    width: number;
    height: number;
}

type ResultsSetter = React.Dispatch<React.SetStateAction<{}>>;
type ReadySetter = React.Dispatch<React.SetStateAction<boolean>>;

export function useConversionSettings(
    originalDimensions: OriginalDimensions | null,
    setConversionResults: ResultsSetter,
    setDownloadReady: ReadySetter,
    forcePreviewUpdate: (quality: number) => void,
) {
    const [selectedPreset, setSelectedPreset] = useState<string>('whytes_hero');
    const [quality, setQuality] = useState<number>(presets.whytes_hero.quality);
    const [customWidth, setCustomWidth] = useState<number | '' > ('');
    const [customHeight, setCustomHeight] = useState<number | '' > ('');

    const setInitialDimensions = (width: number, height: number) => {
        setCustomWidth(width);
        setCustomHeight(height);
    }

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetKey = e.target.value;
        setSelectedPreset(presetKey);
        setQuality(presets[presetKey].quality);
        setConversionResults({});
        setDownloadReady(false);
    };

    const handleQualitySliderChange = (values: number[]) => {
        if (selectedPreset !== 'custom') {
            return;
        }
        setQuality(values[0]);
        setConversionResults({});
        setDownloadReady(false);
        forcePreviewUpdate(values[0]);
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
            const { width, height } = originalDimensions;
            if (width >= height) {
                setCustomWidth(width);
                setCustomHeight(Math.round(width / ratio));
            } else {
                setCustomHeight(height);
                setCustomWidth(Math.round(height * ratio));
            }
        }
        setDownloadReady(false);
        setConversionResults({});
    };
    
    const resetConversionSettings = () => {
        setSelectedPreset('whytes_hero');
        setQuality(presets.whytes_hero.quality);
        setCustomWidth('');
        setCustomHeight('');
    }

    return {
        selectedPreset,
        quality,
        customWidth,
        customHeight,
        handlePresetChange,
        handleQualitySliderChange,
        handleWidthChange,
        handleHeightChange,
        handleAspectRatioChange,
        resetConversionSettings,
        setInitialDimensions,
    };
}
