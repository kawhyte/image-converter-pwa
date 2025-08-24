import React from 'react';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Header = () => {
    return (
        <CardHeader>
            <CardTitle className="text-2xl text-white">Bulk JPEG to WebP Converter</CardTitle>

            <CardDescription>Drag and drop images to convert them using powerful, one-click presets.</CardDescription>
        </CardHeader>
    );
};