import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const presets = {
  whytes_hero: {
    name: 'Website Hero',
    description: 'High-quality preset for hero images.',
    quality: 0.8,
    maxWidth: 1920,
  },
  thumbnail: {
    name: 'Blog Thumbnails',
    description: 'High-quality preset for hero images.',
    quality: 0.8,
    maxWidth: 1200,
  },
  // default: {
  //   name: 'Default',
  //   description: 'A balanced preset for general use.',
  //   quality: 0.7,
  //   maxWidth: 1000,
  // },
  custom: {
    name: 'Custom',
    description: 'Custom settings.',
    quality: 0.75,
    maxWidth: null,
  }
};

export const aspectRatios = {
  '16:9': { ratio: 16 / 9, tip: 'Widescreen' },
  '4:3': { ratio: 4 / 3, tip: 'Standard' },
  '1:1': { ratio: 1, tip: 'Square' },
  '3:2': { ratio: 3 / 2, tip: 'Photography' },
};

export const themes = ['light', 'dark', 'playful'];

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

