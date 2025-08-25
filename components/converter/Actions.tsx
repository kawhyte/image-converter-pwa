import React from 'react';
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
  resetState 
}) => (
  <div className="mt-6 pt-6 border-t flex flex-col items-center gap-4">
    <div className="flex flex-wrap justify-center gap-4">
      <Button 
        onClick={handleBulkConvert} 
        disabled={isConverting || files.length === 0} 
        className="w-full sm:w-auto grow"
        {...({} as any)}
      >
        {isConverting ? `Converting... ${Math.round(conversionProgress)}%` : `Convert ${files.length} File(s)`}
      </Button>
      {allFilesConverted && (
        <Button
          onClick={handleDownloadAll}
          disabled={isZipping}
          variant="secondary"
          className={`w-full sm:w-auto grow relative ${downloadReady ? 'animated-download-ready' : ''}`}
          {...({} as any)}
        >
          <div className="button-inner-bg"></div>
          <span>{isZipping ? 'Zipping...' : 'Download All (.zip)'}</span>
        </Button>
      )}
    </div>
    <Button 
      onClick={resetState} 
      variant="outline-primary" 
      size="sm" 
      className="w-full max-w-xs text-foreground"
      {...({} as any)}
    >
      Clear All
    </Button>
  </div>
);

export default Actions;
