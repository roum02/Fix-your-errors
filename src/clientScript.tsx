"use client";

import Script from 'next/script';
import { useEffect } from 'react';

export default function ClientScript() {
    useEffect(() => {
        const el = document.createElement('pwa-update');
        document.body.appendChild(el);

        // Cleanup function to remove the element when the component unmounts
        return () => {
            document.body.removeChild(el);
        };
    }, []);

    return (
        <Script
            strategy="afterInteractive"
            type="module"
            src="https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate"
        />
    );
}
