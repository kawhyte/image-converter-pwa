import React from "react";
import Image from 'next/image';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Images, Rocket } from "lucide-react";
import { useImageConverter } from "../hooks/useImageConverter";

import FileUpload from "./converter/FileUpload";
import Settings from "./converter/Settings";
import FileList from "./converter/FileList";
import Actions from "./converter/Actions";

const App: React.FC = () => {
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
		<>
			<TooltipProvider>
				<div className='text-foreground min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-300'>
					<div className='mb-4 flex flex-col items-center px-4 text-center md:mb-10'>
						<div className='flex w-full flex-col items-center justify-center gap-2'></div>
						<h1 className='mb-2 flex items-center gap-1 text-2xl font-medium leading-none text-foreground sm:text-3xl md:mb-2.5 md:gap-0 md:text-5xl'>
							<span className='pt-0.5 tracking-tight md:pt-0'>
								ImageRocket
							</span>
							<div className=' flex-col gap-1.5  hidden sm:ml-1 md:ml-1 md:flex'>
								{/* <Images className='flex h-[22px] sm:h-[28px] md:h-[36px]' /> */}
                <Image src="/icons/Rocket.gif" alt="Logo" width={100} height={60} />
							</div>
						</h1>
						<p className='mb-6 max-w-[25ch] text-center text-lg leading-tight text-foreground/65 md:max-w-full md:text-xl'>
						Shrink your images. Speed up your site.
						</p>
					</div>

					<div className='background-gradient-container'>
						<div className='blur-filter'>
							<div className='ellipse ellipse-1'></div>
							<div className='ellipse ellipse-2'></div>
							<div className='ellipse ellipse-3'></div>
							<div className='ellipse ellipse-4'></div>
						</div>
					</div>
					<div className='w-full max-w-4xl mx-auto relative'>
						<Card className='w-full transition-all duration-150 ease-in-out rounded-3xl border border-muted-foreground text-base shadow-xl focus-within:border-foreground/20 hover:border-foreground/10 focus-within:hover:border-foreground/20 bg-slate-900'>
							
              
              <CardHeader className='text-center'>
								<CardTitle className=''>Bulk Image to WebP Converter</CardTitle>
								<CardDescription className=''>
								Drag and drop images to convert them using powerful, one-click presets.
								</CardDescription>
							</CardHeader>

              
							<CardContent className=''>
								<FileUpload fileInputRef={fileInputRef} addFiles={addFiles} />

								{error && (
									<p className='text-destructive text-sm mt-4 text-center whitespace-pre-wrap'>
										{error}
									</p>
								)}

								{files.length > 0 && (
									<div className='mt-6'>
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

										{isConverting && (
											<Progress value={conversionProgress} className='' />
										)}

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
		</>
	);
};

export default App;
