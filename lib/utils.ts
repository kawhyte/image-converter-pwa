import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type OutputFormat = 'webp' | 'png';
export type CropMode = 'exact' | 'resize' | 'custom';
export type PresetGroup = 'cover' | 'gallery' | 'card' | 'asset' | 'custom';

export interface Preset {
  name: string;
  description: string;
  quality: number;
  outputFormat: OutputFormat;
  cropMode: CropMode;
  group: PresetGroup;
  width?: number;
  height?: number;
  maxEdge?: number;
}

export const presets: { [key: string]: Preset } = {
  hotel_food_cover: {
    name: 'Hotel & Food Cover',
    description: 'Hotel listing card, food cover, arena card images.',
    quality: 80,
    outputFormat: 'webp',
    cropMode: 'exact',
    width: 1200,
    height: 800,
    group: 'cover',
  },
  travel_guide_cover: {
    name: 'Travel Guide Cover',
    description: 'Guide listing card and guide hero.',
    quality: 80,
    outputFormat: 'webp',
    cropMode: 'exact',
    width: 1600,
    height: 840,
    group: 'cover',
  },
  arena_hero: {
    name: 'Arena Hero Photo',
    description: 'Top gallery block on arena detail page.',
    quality: 80,
    outputFormat: 'webp',
    cropMode: 'exact',
    width: 1600,
    height: 1067,
    group: 'cover',
  },
  gallery: {
    name: 'Gallery & Body Images',
    description: 'Photo grids and inline article photos — longest edge resized, aspect ratio preserved.',
    quality: 80,
    outputFormat: 'webp',
    cropMode: 'resize',
    maxEdge: 1600,
    group: 'gallery',
  },
  card_items: {
    name: 'Food & Arena Items',
    description: 'Arena food/drink items and food dish card grids.',
    quality: 75,
    outputFormat: 'webp',
    cropMode: 'exact',
    width: 900,
    height: 600,
    group: 'card',
  },
  team_logos: {
    name: 'Team Logos',
    description: 'Circular team logos with transparent background.',
    quality: 90,
    outputFormat: 'png',
    cropMode: 'exact',
    width: 200,
    height: 200,
    group: 'asset',
  },
  product_images: {
    name: 'Product Images',
    description: 'Product cards on /essentials with transparent background.',
    quality: 90,
    outputFormat: 'png',
    cropMode: 'exact',
    width: 800,
    height: 800,
    group: 'asset',
  },
  custom: {
    name: 'Custom',
    description: 'Set your own dimensions and quality.',
    quality: 80,
    outputFormat: 'webp',
    cropMode: 'custom',
    group: 'custom',
  },
};

export const PRESET_GROUPS: { key: PresetGroup; label: string }[] = [
  { key: 'cover', label: 'Cover Photos' },
  { key: 'gallery', label: 'Gallery & Body' },
  { key: 'card', label: 'Card Items' },
  { key: 'asset', label: 'PNG Assets' },
  { key: 'custom', label: 'Custom' },
];

export interface ResizeOptions {
  cropMode: CropMode;
  targetWidth?: number;
  targetHeight?: number;
  maxEdge?: number;
  customWidth?: number;
  customHeight?: number;
  outputFormat: OutputFormat;
}

export const aspectRatios: { [key: string]: { ratio: number; tip: string } } = {
  '16:9': { ratio: 16 / 9, tip: 'Widescreen' },
  '4:3': { ratio: 4 / 3, tip: 'Standard' },
  '1:1': { ratio: 1, tip: 'Square' },
  '3:2': { ratio: 3 / 2, tip: 'Photography' },
};

export const themes: string[] = ['light', 'dark', 'playful'];

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getResizeOptions(
  selectedPreset: string,
  customWidth: number | '',
  customHeight: number | ''
): ResizeOptions {
  const preset = presets[selectedPreset];
  if (!preset) {
    return { cropMode: 'custom', outputFormat: 'webp' };
  }

  if (preset.cropMode === 'exact') {
    return {
      cropMode: 'exact',
      targetWidth: preset.width,
      targetHeight: preset.height,
      outputFormat: preset.outputFormat,
    };
  }

  if (preset.cropMode === 'resize') {
    return {
      cropMode: 'resize',
      maxEdge: preset.maxEdge,
      outputFormat: preset.outputFormat,
    };
  }

  return {
    cropMode: 'custom',
    customWidth: typeof customWidth === 'number' && customWidth > 0 ? customWidth : undefined,
    customHeight: typeof customHeight === 'number' && customHeight > 0 ? customHeight : undefined,
    outputFormat: preset.outputFormat,
  };
}

// Fixed: constrain to fit within original bounds, not expand beyond source dimensions
export function calculateAspectRatioDimensions(
  originalDimensions: { width: number; height: number },
  targetRatio: number
): { width: number; height: number } {
  const { width, height } = originalDimensions;
  const heightFromWidth = Math.round(width / targetRatio);
  if (heightFromWidth <= height) {
    return { width, height: heightFromWidth };
  }
  return { width: Math.round(height * targetRatio), height };
}
