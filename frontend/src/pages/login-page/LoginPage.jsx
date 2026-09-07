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
                    "linear-gradient(160deg, #063B5C 0%, #087EA4 55%, #00A6A6 100%)"
            }}
        >

            {/* ==================================================== */}
            {/* FORME DÉCORATIVE — cercle diffus */}
            {/* ==================================================== */}

            <Box
                sx={{
                    position: "absolute",
                    top: { xs: -140, md: -100 },
                    right: { xs: -120, md: -60 },
                    width: 420,
                    height: 420,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(0,166,166,0.35) 0%, rgba(0,166,166,0) 70%)",
                    pointerEvents: "none"
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    bottom: { xs: -160, md: -120 },
                    left: { xs: -100, md: -40 },
                    width: 340,
                    height: 340,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(6,59,92,0.45) 0%, rgba(6,59,92,0) 70%)",
                    pointerEvents: "none"
                }}
            />


            {/* ==================================================== */}
            {/* GRILLE TECH DÉCORATIVE EN FOND */}
            {/* ==================================================== */}

            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.06,
                    backgroundImage:
                        "linear-gradient(#FDF7F2 1px, transparent 1px), linear-gradient(90deg, #FDF7F2 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    pointerEvents: "none"
                }}
            />


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
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "rgba(6, 59, 92, 0.08)",
                    boxShadow: "0 24px 60px -20px rgba(6, 59, 92, 0.45)",
                    bgcolor: "rgba(253, 247, 242, 0.97)",
                    backdropFilter: "blur(6px)"
                }}
            >

                {/* LOGO / TITRE */}

                <img
                    src="/Logo_Principal.svg"
                    alt="Canicule"
                    style={{
                        // marginTop: "12px",
                        // marginBottom: "12px",
                        alignItems: "center",
                        height: "85px",
                        width: "auto",
                        objectFit: "contain",
                        flexGrow: 1,
                        objectPosition: "left"
                    }}
                />

                <Typography
                    sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        mb: 4,
                        letterSpacing: "0.08rem",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        fontWeight: 600
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
                        boxShadow: "0 12px 24px -10px rgba(8, 126, 164, 0.5)"
                    }}
                >
                    {isLoggingIn ? "Connexion..." : "Se connecter"}
                </Button>

            </Paper>

        </Box>

    );

};

export default LoginPage;