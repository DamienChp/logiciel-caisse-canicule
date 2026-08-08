import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const BarcodeScanner = ({ onScan }) => {

    const lastScan = useRef(null);

    useEffect(() => {

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: {
                    width: 300,
                    height: 150
                }
            },
            false
        );

        const success = (decodedText) => {

            // Évite les doubles scans immédiats
            if (lastScan.current === decodedText) {
                return;
            }

            lastScan.current = decodedText;

            console.log("Code détecté :", decodedText);

            onScan(decodedText);

            setTimeout(() => {
                lastScan.current = null;
            }, 1500);
        };

        const error = () => {};

        scanner.render(success, error);

        return () => {
            scanner.clear().catch(() => {});
        };

    }, [onScan]);

    return (
        <div id="reader" />
    );
};

export default BarcodeScanner;