"use client";

import Script from 'next/script';
import { useEffect } from 'react';

export default function ClientScript() {

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/pwabuilder-sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }, []);

    useEffect(() => {
        const el = document.createElement('pwa-update');
        document.body.appendChild(el);
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
