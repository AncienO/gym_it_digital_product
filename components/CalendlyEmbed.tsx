"use client";

import { InlineWidget } from "react-calendly";

interface CalendlyEmbedProps {
    url: string;
}

export const CalendlyEmbed = ({ url }: CalendlyEmbedProps) => {
    return (
        <div className="w-full flex justify-center">
            <InlineWidget
                url={url}
                styles={{
                    height: '1000px',
                    width: '100%',
                    minWidth: '320px'
                }}
                pageSettings={{
                    backgroundColor: '18181b', // zinc-950
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: '10b981', // emerald-500
                    textColor: 'ffffff'
                }}
            />
        </div>
    );
};
