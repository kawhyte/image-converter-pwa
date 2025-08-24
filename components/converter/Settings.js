import React from 'react';
import { presets, aspectRatios } from '../../lib/utils';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Settings = ({ selectedPreset, handlePresetChange, quality, handleQualitySliderChange, customWidth, handleWidthChange, customHeight, handleHeightChange, handleAspectRatioChange }) => (
    <div className="p-4 border rounded-lg mb-6 bg-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className='text-stone-400'>
                <Label className=' text-stone-400 mb-3' htmlFor="preset">Optimization Preset</Label>
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
            <div className='text-stone-400 '>
                <Label className='mb-2' htmlFor="quality">Quality: <span className="font-bold text-stone-400">{Math.round(quality * 100)}</span></Label>
                <Slider id="quality" min={0.1} max={1} step={0.01} value={[quality]} onValueChange={(value) => handleQualitySliderChange({ target: { value: value[0] } })} className="w-full bg-stone-400" />
            </div>
        </div>
        {selectedPreset === 'custom' && (
            <div className="mt-4 pt-4 border-t border-border/50 text-stone-400">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className='mb-2' htmlFor="width">Width (px)</Label>
                        <Input type="number" id="width" value={customWidth} onChange={handleWidthChange} />
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="height">Height (px)</Label>
                        <Input type="number" id="height" value={customHeight} onChange={handleHeightChange} />
                    </div>
                </div>



                
                <div className="flex flex-wrap gap-2 mt-4">
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