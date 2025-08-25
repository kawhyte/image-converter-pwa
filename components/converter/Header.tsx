import React from 'react';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Header: React.FC = () => {
    return (
        <CardHeader className="">
            <CardTitle className="text-2xl text-white">Bulk JPEG to WebP Converter</CardTitle>
            <CardDescription className="">Drag and drop images to convert them using powerful, one-click presets.</CardDescription>
        </CardHeader>
    );
};

export default Header;
