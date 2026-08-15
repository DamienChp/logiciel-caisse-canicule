import React, { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    InputAdornment,
    IconButton
} from "@mui/material";

import {
    Email,
    Lock,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/auth";


// ======================================================
// PAGE DE CONNEXION
// ======================================================

const LoginPage = () => {

    const { login, isLoggingIn } = useAuthStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    // ==================================================
    // SOUMISSION DU FORMULAIRE
    // ==================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        const result = await login({ email, password });

        if (result.success) {

            navigate("/");

        } else {

            setErrorMessage(result.message);

        }

    };


    // ==================================================
    // RENDU
    // ==================================================

    return (

        <Box
            sx={{
                height: "100dvh",
                width: "100%",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background:
                    "linear-gradient(180deg, #FBF8F0 0%, #FBF8F0 55%, #F3E3B8 75%, #E8B96B 100%)"
            }}
        >

            {/* ==================================================== */}
            {/* HALO SOLEIL DÉCORATIF */}
            {/* ==================================================== */}

            <Box
                sx={{
                    position: "absolute",
                    top: { xs: -120, md: -80 },
                    right: { xs: -100, md: -40 },
                    width: 380,
                    height: 380,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(217,164,65,0.35) 0%, rgba(217,164,65,0) 70%)",
                    pointerEvents: "none"
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    top: { xs: -60, md: -20 },
                    left: { xs: -80, md: 60 },
                    width: 260,
                    height: 260,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(79,179,169,0.25) 0%, rgba(79,179,169,0) 70%)",
                    pointerEvents: "none"
                }}
            />


            {/* ==================================================== */}
            {/* VAGUES DÉCORATIVES EN BAS D'ÉCRAN */}
            {/* ==================================================== */}

            <Box
                component="svg"
                viewBox="0 0 1440 220"
                preserveAspectRatio="none"
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: { xs: 140, md: 200 },
                    pointerEvents: "none"
                }}
            >

                <path
                    d="M0,120 C240,180 480,60 720,90 C960,120 1200,180 1440,110 L1440,220 L0,220 Z"
                    fill="#4FB3A9"
                    opacity="0.18"
                />

                <path
                    d="M0,150 C240,90 480,190 720,150 C960,110 1200,60 1440,140 L1440,220 L0,220 Z"
                    fill="#D9A441"
                    opacity="0.25"
                />

            </Box>


            {/* ==================================================== */}
            {/* CARTE DE CONNEXION */}
            {/* ==================================================== */}

            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={0}
                sx={{
                    position: "relative",
                    zIndex: 1,
                    p: { xs: 4, sm: 5 },
                    width: "100%",
                    maxWidth: 420,
                    mx: 2,
                    borderRadius: 5,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 24px 60px -20px rgba(43, 33, 20, 0.25)",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(6px)"
                }}
            >

                {/* LOGO / TITRE */}

                <Typography
                    sx={{
                        textAlign: "center",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: "0.35rem",
                        fontSize: { xs: "1.9rem", sm: "2.2rem" },
                        color: "primary.main",
                        mb: 0.5
                    }}
                >
                    CANICULE
                </Typography>

                <Typography
                    sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        mb: 4,
                        letterSpacing: "0.05rem"
                    }}
                >
                    Espace boutique
                </Typography>


                {errorMessage && (

                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {errorMessage}
                    </Alert>

                )}


                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    sx={{ mb: 2.5 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email fontSize="small" sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    label="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    sx={{ mb: 4 }}
                    InputProps={{

                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock fontSize="small" sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),

                        endAdornment: (
                            <InputAdornment position="end">

                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    edge="end"
                                    size="small"
                                >
                                    {showPassword ? (
                                        <VisibilityOff fontSize="small" />
                                    ) : (
                                        <Visibility fontSize="small" />
                                    )}
                                </IconButton>

                            </InputAdornment>
                        )

                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isLoggingIn}
                    sx={{
                        py: 1.4,
                        fontSize: "1rem",
                        boxShadow: "0 12px 24px -10px rgba(217, 164, 65, 0.6)"
                    }}
                >
                    {isLoggingIn ? "Connexion..." : "Se connecter"}
                </Button>

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        mt: 3
                    }}
                >
                    Bandol · Toulon · La Londe-les-Maures
                </Typography>

            </Paper>

        </Box>

    );

};

export default LoginPage;