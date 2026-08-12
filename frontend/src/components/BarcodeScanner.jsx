// import React, { useEffect, useRef } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";

// const BarcodeScanner = ({ onScan }) => {

//     const lastScan = useRef(null);

//     useEffect(() => {

//         const scanner = new Html5QrcodeScanner(
//             "reader",
//             {
//                 fps: 10,
//                 qrbox: {
//                     width: 300,
//                     height: 150
//                 }
//             },
//             false
//         );

//         const success = (decodedText) => {

//             // Évite les doubles scans immédiats
//             if (lastScan.current === decodedText) {
//                 return;
//             }

//             lastScan.current = decodedText;

//             console.log("Code détecté :", decodedText);

//             onScan(decodedText);

//             setTimeout(() => {
//                 lastScan.current = null;
//             }, 1500);
//         };

//         const error = () => {};

//         scanner.render(success, error);

//         return () => {
//             scanner.clear().catch(() => {});
//         };

//     }, [onScan]);

//     return (
//         <div id="reader" />
//     );
// };

// export default BarcodeScanner;


import React, { useEffect, useRef, useState } from "react";

import {
    Box,
    Button,
    Typography,
    CircularProgress
} from "@mui/material";

import {
    CameraAlt,
    VideocamOff
} from "@mui/icons-material";

import { Html5Qrcode } from "html5-qrcode";


const BarcodeScanner = ({ onScan }) => {

    const scannerRef = useRef(null);
    const lastScan = useRef(null);

    const [cameraActive, setCameraActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const startCamera = async () => {

        if (scannerRef.current) {
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const scanner = new Html5Qrcode("reader");

            scannerRef.current = scanner;

            await scanner.start(
                {
                    facingMode: "environment"
                },
                {
                    fps: 10,

                    qrbox: (viewfinderWidth, viewfinderHeight) => {

                        const size = Math.min(
                            viewfinderWidth * 0.8,
                            viewfinderHeight * 0.5
                        );

                        return {
                            width: size,
                            height: size
                        };
                    },

                    aspectRatio: 1
                },

                (decodedText) => {

                    if (lastScan.current === decodedText) {
                        return;
                    }

                    lastScan.current = decodedText;

                    console.log("Code détecté :", decodedText);

                    onScan(decodedText);

                    setTimeout(() => {
                        lastScan.current = null;
                    }, 1500);
                },

                () => {}
            );

            setCameraActive(true);

        } catch (err) {

            console.error("Erreur caméra :", err);

            setError(
                "Impossible d'accéder à la caméra."
            );

            scannerRef.current = null;

        } finally {

            setLoading(false);

        }
    };


    const stopCamera = async () => {

        if (!scannerRef.current) {
            return;
        }

        try {

            await scannerRef.current.stop();
            await scannerRef.current.clear();

        } catch (err) {

            console.error(
                "Erreur lors de l'arrêt de la caméra :",
                err
            );

        } finally {

            scannerRef.current = null;
            setCameraActive(false);

        }
    };


    useEffect(() => {

        return () => {

            if (scannerRef.current) {

                scannerRef.current
                    .stop()
                    .then(() => scannerRef.current?.clear())
                    .catch(() => {});

            }

        };

    }, []);


    return (

        <Box
            sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
                bgcolor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >

            {/* CAMÉRA */}

            <Box
                id="reader"
                sx={{
                    width: "100%",
                    height: "100%",

                    "& video": {
                        width: "100% !important",
                        height: "100% !important",
                        objectFit: "cover"
                    },

                    "& img": {
                        display: "none"
                    },

                    "&__scan_region": {
                        border: "none"
                    }
                }}
            />


            {/* ÉCRAN AVANT ACTIVATION */}

            {!cameraActive && (

                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",

                        color: "white",
                        textAlign: "center",

                        background:
                            "linear-gradient(145deg, #1a1a1a, #292929)"
                    }}
                >

                    <Box
                        sx={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            bgcolor: "rgba(255,255,255,0.1)",

                            mb: 2
                        }}
                    >

                        <CameraAlt
                            sx={{
                                fontSize: 35
                            }}
                        />

                    </Box>


                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        mb={0.5}
                    >
                        Scanner un produit
                    </Typography>


                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.7,
                            mb: 3
                        }}
                    >
                        Activez la caméra pour scanner un code-barres
                    </Typography>


                    <Button
                        variant="contained"
                        startIcon={<CameraAlt />}
                        onClick={startCamera}
                        disabled={loading}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.2
                        }}
                    >

                        {loading
                            ? "Activation..."
                            : "Activer la caméra"
                        }

                    </Button>


                    {error && (

                        <Typography
                            variant="body2"
                            color="error.light"
                            sx={{
                                mt: 2
                            }}
                        >
                            {error}
                        </Typography>

                    )}

                </Box>

            )}


            {/* BOUTON ARRÊT */}

            {cameraActive && (

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<VideocamOff />}
                    onClick={stopCamera}
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: "50%",
                        transform: "translateX(-50%)",

                        borderRadius: 2,

                        px: 2.5,

                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.4)"
                    }}
                >
                    Éteindre la caméra
                </Button>

            )}

        </Box>
    );
};


export default BarcodeScanner;