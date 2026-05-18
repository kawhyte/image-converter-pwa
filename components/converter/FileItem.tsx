import React, { useMemo, useEffect } from 'react';
import { formatBytes } from '../../lib/utils';
import type { WebPConversionResult } from '../../lib/imageUtils';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
    file: File;
    result?: WebPConversionResult;
    preview?: WebPConversionResult;
    aiFileName?: string;
    isNaming: string | null;
    namingTimer: number;
    convertingFile: string | null;
    handleAiRename: (file: File) => void;
}

const FileItem: React.FC<Props> = ({ file, result, preview, aiFileName, isNaming, namingTimer, convertingFile, handleAiRename }) => {
    const displaySize = result ? result.webpSize : (preview ? preview.webpSize : null);

    // Create objectUrl once per file, revoke on unmount
    const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);
    useEffect(() => () => URL.revokeObjectURL(objectUrl), [objectUrl]);

    const outputFormat = result?.outputFormat ?? 'webp';
    const ext = outputFormat === 'png' ? 'png' : 'webp';

    const baseName = aiFileName
        ? aiFileName
        : file.name.split('.').slice(0, -1).join('.');
    const displayName = aiFileName ? `${aiFileName}.${ext}` : file.name;
    const downloadName = `${baseName}.${ext}`;

    const outputDims = result
        ? `${result.outputWidth} × ${result.outputHeight}`
        : preview
            ? `Est. ${preview.outputWidth} × ${preview.outputHeight}`
            : null;

    return (
        <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
            <TooltipProvider>
                <div className="flex items-center gap-3 overflow-hidden">
                    <img
                        src={objectUrl}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded-md shrink-0"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                            {displaySize !== null && (
                                <>
                                    <span className="mx-1">→</span>
                                    <span className={result ? 'font-bold' : ''}>
                                        {result ? '' : 'Est. '}{formatBytes(displaySize)}
                                    </span>
                                </>
                            )}
                        </p>
                        {outputDims && (
                            <p className="text-xs text-muted-foreground/70">{outputDims} px</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {isNaming === file.name && (
                        <div className="flex items-center justify-center h-8 w-24 text-sm text-green-500 font-semibold tabular-nums">
                            AI {namingTimer}s
                        </div>
                    )}
                    {convertingFile === file.name && !result && (
                        <div className="flex items-center justify-center h-8 w-24 text-sm text-primary font-semibold">
                            Converting...
                        </div>
                    )}
                    {isNaming !== file.name && convertingFile !== file.name && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost" onClick={() => handleAiRename(file)} disabled={isNaming !== null} className="h-8 w-8" {...({} as any)}>
                                        <svg className='text-foreground' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="m15 5 3 3"/></svg>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="">
                                    <p>Rename with AI</p>
                                </TooltipContent>
                            </Tooltip>
                            {result && (
                                <a href={result.webpDataUrl} download={downloadName}>
                                    <Button size="sm" variant="outline-primary" className="text-foreground" {...({} as any)}>Save</Button>
                                </a>
                            )}
                        </>
                    )}
                </div>
            </TooltipProvider>
        </div>
    );
};

export default FileItem;
