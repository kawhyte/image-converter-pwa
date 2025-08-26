import { useState, useRef } from 'react';

interface OriginalDimensions {
  width: number;
  height: number;
}

export function useFileHandler(setInitialDimensions: (width: number, height: number) => void) {
  const [files, setFiles] = useState<File[]>([]);
  const [originalDimensions, setOriginalDimensions] = useState<OriginalDimensions | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles = Array.from(newFiles).filter(file => ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type));
    if (validFiles.length === 0 && newFiles.length > 0) { setError(`No valid image files selected.`); return; }
    
    if (files.length === 0 && validFiles.length > 0) {
        const firstImage = validFiles[0];
        const img = new Image();
        img.src = URL.createObjectURL(firstImage);
        img.onload = () => {
            setOriginalDimensions({ width: img.width, height: img.height });
            setInitialDimensions(img.width, img.height);
            URL.revokeObjectURL(img.src);
        };
    }

    setFiles(prevFiles => {
        const existingFileNames = new Set(prevFiles.map(f => f.name));
        const uniqueNewFiles = validFiles.filter(f => !existingFileNames.has(f.name));
        return [...prevFiles, ...uniqueNewFiles];
    });
    setError('');
  };

  const resetFiles = () => {
    setFiles([]);
    setOriginalDimensions(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return {
    files,
    originalDimensions,
    error,
    setError,
    fileInputRef,
    addFiles,
    resetFiles,
  };
}
