import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const BarcodeScanner = ({ onScan }) => {

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

            console.log("Code-barres détecté :", decodedText);

            onScan(decodedText);

            scanner.clear();
        };

        const error = (errorMessage) => {
            // Les erreurs de scan sont normales tant qu'aucun code n'est détecté
            // console.log('Error :', errorMessage)
            
        };

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