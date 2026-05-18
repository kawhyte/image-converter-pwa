import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface ActionsProps {
  handleBulkConvert: () => void;
  isConverting: boolean;
  files: File[];
  conversionProgress: number;
  allFilesConverted: boolean;
  handleDownloadAll: () => void;
  isZipping: boolean;
  downloadReady: boolean;
  resetState: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  handleBulkConvert,
  isConverting,
  files,
  conversionProgress,
  allFilesConverted,
  handleDownloadAll,
  isZipping,
  downloadReady,
  resetState,
}) => {
  const [clearPending, setClearPending] = useState(false);
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const handleClear = () => {
    if (clearPending) {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      setClearPending(false);
      resetState();
    } else {
      setClearPending(true);
      clearTimerRef.current = setTimeout(() => setClearPending(false), 3000);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-4 w-full">
        <Button
          onClick={handleBulkConvert}
          disabled={isConverting || files.length === 0}
          className="w-full sm:w-auto grow"
          {...({} as any)}
        >
          {isConverting ? `Converting… ${Math.round(conversionProgress)}%` : `Convert ${files.length} File(s)`}
        </Button>
        {allFilesConverted && (
          <Button
            onClick={handleDownloadAll}
            disabled={isZipping}
            variant="secondary"
            className={`w-full sm:w-auto grow ${downloadReady ? 'animated-download-ready' : ''}`}
            {...({} as any)}
          >
            {isZipping ? 'Zipping…' : 'Download All (.zip)'}
          </Button>
        )}
      </div>
      <Button
        onClick={handleClear}
        variant={clearPending ? 'destructive' : 'outline-primary'}
        size="sm"
        className="w-full max-w-xs"
        {...({} as any)}
      >
        {clearPending ? 'Tap again to clear →' : 'Clear All'}
      </Button>
    </div>
  );
};

export default Actions;
