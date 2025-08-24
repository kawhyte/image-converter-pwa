import React from 'react';
import { presets, aspectRatios, formatBytes } from '../lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useImageConverter } from '../hooks/useImageConverter';

const Header = () => {
    return (
        <CardHeader>
            <CardTitle className="text-2xl bg-amber-400">Bulk Image to WebP Converter</CardTitle>

            <CardDescription>Drag and drop images to convert them using powerful, one-click presets.</CardDescription>
        </CardHeader>
    );
};

const FileUpload = ({ fileInputRef, addFiles }) => {
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        e.currentTarget.classList.remove('border-primary');
        if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add('border-primary'); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.remove('border-primary'); };
    const handleFileChange = (e) => { if (e.target.files) addFiles(e.target.files); };

    return (
        <div
            className="w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:border-primary/80"
            onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current.click()}
        >
            <Input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/gif,image/bmp" onChange={handleFileChange} multiple />
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            <p className="text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop files</p>
            <p className="text-xs text-muted-foreground mt-1">Bulk conversion is supported</p>
        </div>
    );
};

const Settings = ({ selectedPreset, handlePresetChange, quality, handleQualitySliderChange, customWidth, handleWidthChange, customHeight, handleHeightChange, handleAspectRatioChange }) => (
    <div className="p-4 border rounded-lg bg-muted/50 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
                <Label htmlFor="preset">Optimization Preset</Label>
                <Select id="preset" value={selectedPreset} onValueChange={(value) => handlePresetChange({ target: { value } })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(presets).map(([key, preset]) => (
                            <SelectItem key={key} value={key}>{preset.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">{presets[selectedPreset].description}</p>
            </div>
            <div>
                <Label htmlFor="quality">Quality: <span className="font-bold text-primary">{Math.round(quality * 100)}</span></Label>
                <Slider id="quality" min={0.1} max={1} step={0.01} value={[quality]} onValueChange={(value) => handleQualitySliderChange({ target: { value: value[0] } })} className="w-full" />
            </div>
        </div>
        {selectedPreset === 'custom' && (
            <div className="mt-4 pt-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="width">Width (px)</Label>
                        <Input type="number" id="width" value={customWidth} onChange={handleWidthChange} />
                    </div>
                    <div>
                        <Label htmlFor="height">Height (px)</Label>
                        <Input type="number" id="height" value={customHeight} onChange={handleHeightChange} />
                    </div>
                </div>



                
                <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(aspectRatios).map(([name, {ratio, tip}]) => (
                        <Tooltip key={name}>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => handleAspectRatioChange(ratio)}>
                                    {name}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tip}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const FileItem = ({ file, result, preview, aiFileName, isNaming, namingTimer, convertingFile, handleAiRename }) => {
    const displaySize = result ? result.convertedSize : (preview ? preview.convertedSize : null);
    const displayName = aiFileName ? `${aiFileName}.webp` : file.name;
    const objectUrl = URL.createObjectURL(file);

    return (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 overflow-hidden">
                <img src={objectUrl} alt={file.name} className="w-12 h-12 object-cover rounded-md shrink-0" onLoad={() => URL.revokeObjectURL(objectUrl)} />
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{displayName}</p>
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
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {isNaming === file.name && (
                    <div className="flex items-center justify-center h-8 w-24 text-sm text-green-500 font-semibold tabular-nums">
                        ✨ {namingTimer}s
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
                                <Button size="icon" variant="ghost" onClick={() => handleAiRename(file)} disabled={isNaming !== null} className="h-8 w-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="m15 5 3 3"/></svg>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Rename with AI</p>
                            </TooltipContent>
                        </Tooltip>
                        {result && (
                            <a href={result.webpDataUrl} download={`${displayName.split('.').slice(0, -1).join('.')}.webp`}>
                                <Button size="sm" variant="outline">Save</Button>
                            </a>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const FileList = ({ files, conversionResults, previewResults, aiFileNames, isNaming, namingTimer, convertingFile, handleAiRename }) => (
    <div className="space-y-4 max-h-72 file-list-container">
        {files.map(file => (
            <FileItem
                key={file.name}
                file={file}
                result={conversionResults[file.name]}
                preview={previewResults[file.name]}
                aiFileName={aiFileNames[file.name]}
                isNaming={isNaming}
                namingTimer={namingTimer}
                convertingFile={convertingFile}
                handleAiRename={handleAiRename}
            />
        ))}
    </div>
);

const Actions = ({ handleBulkConvert, isConverting, files, conversionProgress, allFilesConverted, handleDownloadAll, isZipping, downloadReady, resetState }) => (
    <div className="mt-6 pt-6 border-t flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={handleBulkConvert} disabled={isConverting || files.length === 0} className="w-full sm:w-auto grow">
                {isConverting ? `Converting... ${Math.round(conversionProgress)}%` : `Convert ${files.length} File(s)`}
            </Button>
            {allFilesConverted && (
                <Button
                    onClick={handleDownloadAll}
                    disabled={isZipping}
                    variant="secondary"
                    className={`w-full sm:w-auto grow relative ${downloadReady ? 'animated-download-ready' : ''}`}>
                    <div className="button-inner-bg"></div>
                    <span>{isZipping ? 'Zipping...' : 'Download All (.zip)'}</span>
                </Button>
            )}
        </div>
        <Button onClick={resetState} variant="outline" size="sm" className="w-full max-w-xs">Clear All</Button>
    </div>
);

export function App() {
  const {
    files,
    aiFileNames,
    isNaming,
    namingTimer,
    conversionResults,
    previewResults,
    selectedPreset,
    quality,
    customWidth,
    customHeight,
    isConverting,
    conversionProgress,
    convertingFile,
    downloadReady,
    error,
    isZipping,
    fileInputRef,
    addFiles,
    handlePresetChange,
    handleQualitySliderChange,
    handleWidthChange,
    handleHeightChange,
    handleAspectRatioChange,
    resetState,
    handleBulkConvert,
    handleDownloadAll,
    handleAiRename,
    allFilesConverted,
  } = useImageConverter();

  return (
    <TooltipProvider>
      <div className="text-foreground min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300">
        <div className="background-gradient-container">
            <div className="blur-filter">
                <div className="ellipse ellipse-1"></div>
                <div className="ellipse ellipse-2"></div>
                <div className="ellipse ellipse-3"></div>
                <div className="ellipse ellipse-4"></div>
            </div>
        </div>
        <div className="w-full max-w-4xl mx-auto relative">
          <Card className="w-full transition-all duration-150 ease-in-out rounded-3xl border border-muted-foreground bg-muted text-base shadow-xl focus-within:border-foreground/20 hover:border-foreground/10 focus-within:hover:border-foreground/20">
            <Header />
            <CardContent>
              <FileUpload fileInputRef={fileInputRef} addFiles={addFiles} />

              {error && <p className="text-destructive text-sm mt-4 text-center whitespace-pre-wrap">{error}</p>}

              {files.length > 0 && (
                <div className="mt-6">
                  <Settings
                      selectedPreset={selectedPreset}
                      handlePresetChange={handlePresetChange}
                      quality={quality}
                      handleQualitySliderChange={handleQualitySliderChange}
                      customWidth={customWidth}
                      handleWidthChange={handleWidthChange}
                      customHeight={customHeight}
                      handleHeightChange={handleHeightChange}
                      handleAspectRatioChange={handleAspectRatioChange}
                  />

                  {isConverting && <Progress value={conversionProgress} />}

                  <FileList
                      files={files}
                      conversionResults={conversionResults}
                      previewResults={previewResults}
                      aiFileNames={aiFileNames}
                      isNaming={isNaming}
                      namingTimer={namingTimer}
                      convertingFile={convertingFile}
                      handleAiRename={handleAiRename}
                  />
                  <Actions
                      handleBulkConvert={handleBulkConvert}
                      isConverting={isConverting}
                      files={files}
                      conversionProgress={conversionProgress}
                      allFilesConverted={allFilesConverted}
                      handleDownloadAll={handleDownloadAll}
                      isZipping={isZipping}
                      downloadReady={downloadReady}
                      resetState={resetState}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}