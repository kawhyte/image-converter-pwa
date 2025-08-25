import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Preset {
  name: string;
  description: string;
  quality: number;
  maxWidth: number | null;
}

export const presets: { [key: string]: Preset } = {
  whytes_hero: {
    name: 'Website Hero',
    description: 'High-quality preset for hero images.',
    quality: 80,
    maxWidth: 1920,
  },
  thumbnail: {
    name: 'Blog Thumbnails',
    description: 'High-quality preset for hero images.',
    quality: 80,
    maxWidth: 1200,
  },
  custom: {
    name: 'Custom',
    description: 'Custom settings.',
    quality: 75,
    maxWidth: null,
  }
};

interface AspectRatio {
  ratio: number;
  tip: string;
}

export const aspectRatios: { [key: string]: AspectRatio } = {
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

