import React from 'react';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Header = () => {
    return (
        <CardHeader>
            <CardTitle className="text-2xl bg-amber-400">Bulk Image to WebP Converter</CardTitle>

            <CardDescription>Drag and drop images to convert them using powerful, one-click presets.</CardDescription>
        </CardHeader>
    );
};