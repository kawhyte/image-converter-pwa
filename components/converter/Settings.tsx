import React from "react";
import { presets, aspectRatios } from "../../lib/utils";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
	selectedPreset: string;
	handlePresetChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	quality: number;
	handleQualitySliderChange: (values: number[]) => void;
	customWidth: number | "";
	handleWidthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	customHeight: number | "";
	handleHeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleAspectRatioChange: (ratio: number) => void;
}

const Settings: React.FC<Props> = ({
	selectedPreset,
	handlePresetChange,
	quality,
	handleQualitySliderChange,
	customWidth,
	handleWidthChange,
	customHeight,
	handleHeightChange,
	handleAspectRatioChange,
}) => (
	<div className='p-6 border rounded-2xl mb-6 bg-card'>
		<TooltipProvider>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
				<div className='text-muted-foreground'>
					<Label className='text-muted-foreground mb-3' htmlFor='preset'>
						Optimization Preset
					</Label>
					<Select
						id='preset'
						value={selectedPreset}
						onValueChange={(value: string) =>
							handlePresetChange({
								target: { value },
							} as React.ChangeEvent<HTMLSelectElement>)
						}>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Select a preset' />
						</SelectTrigger>
						<SelectContent className=''>
							{Object.entries(presets).map(([key, preset]) => (
								<SelectItem key={key} value={key} className=''>
									{(preset as any).name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className='text-xs text-muted-foreground mt-1'>
						{(presets as any)[selectedPreset].description}
					</p>
				</div>
				<div className='text-muted-foreground'>
					<Label className='mb-2' htmlFor='quality'>
						Quality:{" "}
						<span className='font-bold text-foreground'>{quality}</span>
						{selectedPreset !== "custom" && (
							<span className='text-xs ml-2'>(Preset)</span>
						)}
					</Label>{" "}
					<Slider
						id='quality'
						min={10}
						max={100}
						step={1}
						value={[quality]}
						onValueChange={(value: number[]) =>
							handleQualitySliderChange(value)
						}
						className={`w-full ${
							selectedPreset !== "custom"
								? "opacity-50 pointer-events-none"
								: ""
						}`}
						disabled={selectedPreset !== "custom"}
						defaultValue={[quality]}
					/>


  {selectedPreset !== 'custom' && (
        <p className="text-xs text-muted-foreground mt-1">
            Switch to Custom preset to adjust quality manually
        </p>
    )}

				</div>
			</div>
			{selectedPreset === "custom" && (
				<div className='mt-4 pt-4 border-t border-border/50 text-muted-foreground'>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label className='mb-2' htmlFor='width'>
								Width (px)
							</Label>
							<Input
								type='number'
								id='width'
								value={customWidth}
								onChange={handleWidthChange}
								className=''
								{...({} as any)}
							/>
						</div>
						<div>
							<Label className='mb-2' htmlFor='height'>
								Height (px)
							</Label>
							<Input
								type='number'
								id='height'
								value={customHeight}
								onChange={handleHeightChange}
								className=''
								{...({} as any)}
							/>
						</div>
					</div>
					<div className='flex flex-wrap gap-2 mt-4'>
						{Object.entries(aspectRatios).map(([name, { ratio, tip }]) => (
							<Tooltip key={name}>
								<TooltipTrigger asChild>
									<Button
										size='sm'
										variant='outline'
										onClick={() => handleAspectRatioChange(ratio as number)}
										{...({} as any)}>
										{name}
									</Button>
								</TooltipTrigger>
								<TooltipContent className=''>
									<p>{tip as string}</p>
								</TooltipContent>
							</Tooltip>
						))}
					</div>
				</div>
			)}
		</TooltipProvider>
	</div>
);

export default Settings;
