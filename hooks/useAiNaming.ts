import { useState, useRef } from 'react';
import { renameWithAi } from '../lib/aiUtils';

interface AiFileNames {
  [key: string]: string;
}

export function useAiNaming() {
    const [aiFileNames, setAiFileNames] = useState<AiFileNames>({});
    const [isNaming, setIsNaming] = useState<string | null>(null);
    const [namingTimer, setNamingTimer] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    const resetAiNaming = () => {
        setAiFileNames({});
        setIsNaming(null);
    }

    return {
        aiFileNames,
        isNaming,
        namingTimer,
        error,
        setError,
        handleAiRename,
        resetAiNaming,
    };
}
