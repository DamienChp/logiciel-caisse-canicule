import React, { useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    Divider,
    LinearProgress,
    Alert,
    Chip
} from "@mui/material";

import {
    CheckCircle,
    CloudUpload,
    Inventory,
    Category
} from "@mui/icons-material";

import {
    useProductStore
} from "../../../store/product";


const ImportStock = ({
    open,
    onClose,
    onImportSuccess
}) => {

    // ==========================================
    // STATES
    // ==========================================

    const [step, setStep] = useState(1);

    const [file, setFile] = useState(null);

    const [rayons, setRayons] = useState([]);

    const [familles, setFamilles] = useState([]);

    const [loading, setLoading] = useState(false);

    const [loadingMessage, setLoadingMessage] = useState("");

    const [importResult, setImportResult] = useState(null);

    const [error, setError] = useState(null);


    // ==========================================
    // ZUSTAND
    // ==========================================

    const analyzeImport =
        useProductStore(
            (state) =>
                state.analyzeImport
        );


    const importStock =
        useProductStore(
            (state) =>
                state.importStock
        );


    // ==========================================
    // ETAPE 1
    // SELECTION DU FICHIER
    // ==========================================

    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);

        setError(null);

    };


    // ==========================================
    // ETAPE 1 → ETAPE 2
    // ANALYSE DU FICHIER
    // ==========================================

    const handleAnalyze = async () => {

        if (!file) {
            return;
        }


        try {

            setLoading(true);

            setError(null);


            const result =
                await analyzeImport(file);


            if (!result.success) {

                setError(
                    result.message
                );

                return;
            }


            // ==================================
            // RAYONS
            // ==================================

            setRayons(
                (result.rayons || []).map(
                    (rayon) => ({
                        ...rayon,
                        name:
                            rayon.name || ""
                    })
                )
            );


            // ==================================
            // FAMILLES
            // ==================================

            setFamilles(
                (result.familles || []).map(
                    (famille) => ({
                        ...famille,
                        name:
                            famille.name || ""
                    })
                )
            );


            setStep(2);


        } catch (error) {

            console.error(
                "Erreur analyse import :",
                error
            );

            setError(
                "Une erreur est survenue lors de l'analyse du fichier."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // MODIFICATION RAYON
    // ==========================================

    const handleRayonChange = (
        code,
        value
    ) => {

        setRayons(
            (current) =>
                current.map(
                    (rayon) =>
                        rayon.code === code
                            ? {
                                ...rayon,
                                name: value
                            }
                            : rayon
                )
        );

    };


    // ==========================================
    // MODIFICATION FAMILLE
    // ==========================================

    const handleFamilleChange = (
        code,
        rayonCode,
        value
    ) => {

        setFamilles(
            (current) =>
                current.map(
                    (famille) =>
                        famille.code === code &&
                        famille.rayonCode === rayonCode
                            ? {
                                ...famille,
                                name: value
                            }
                            : famille
                )
        );

    };


    // ==========================================
    // VALIDATION
    // ==========================================

    const rayonsValid =
        rayons.length === 0 ||
        rayons.every(
            (rayon) =>
                rayon.name.trim() !== ""
        );


    const famillesValid =
        familles.length === 0 ||
        familles.every(
            (famille) =>
                famille.name.trim() !== ""
        );


    // ==========================================
    // ETAPE 2 → ETAPE 3
    // ==========================================

    const handleCategoriesContinue =
        async () => {

            if (!rayonsValid) {
                return;
            }

            if (!famillesValid) {
                return;
            }


            await handleImport();

        };


    // ==========================================
    // ETAPE 3
    // IMPORT
    // ==========================================

    const handleImport = async () => {

        try {

            setLoading(true);

            setError(null);

            setStep(3);


            // ==================================
            // RAYONS / FAMILLES
            // ==================================

            setLoadingMessage(
                "Enregistrement des rayons et familles..."
            );


            const result =
                await importStock(
                    file,
                    rayons,
                    familles
                );


            if (!result.success) {

                setError(
                    result.message
                );

                setStep(2);

                return;
            }


            // ==================================
            // FIN
            // ==================================

            setLoadingMessage(
                "Import terminé !"
            );


            setImportResult(
                result.data
            );


            setStep(4);


            if (onImportSuccess) {

                onImportSuccess();

            }


        } catch (error) {

            console.error(
                "Erreur import :",
                error
            );


            setError(
                "Une erreur est survenue pendant l'import."
            );


            setStep(2);


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FERMER / RESET
    // ==========================================

    const handleClose = () => {

        if (loading) {
            return;
        }


        setStep(1);

        setFile(null);

        setRayons([]);

        setFamilles([]);

        setImportResult(null);

        setLoading(false);

        setLoadingMessage("");

        setError(null);


        onClose();

    };


    // ==========================================
    // RENDU
    // ==========================================

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                Importer le stock
            </DialogTitle>


            <DialogContent>

                {/* ================================= */}
                {/* INDICATEUR ETAPES */}
                {/* ================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        mb: 4,
                        mt: 1
                    }}
                >

                    {[1, 2, 3, 4].map(
                        (number) => (

                            <Chip
                                key={number}
                                label={number}
                                color={
                                    step >= number
                                        ? "primary"
                                        : "default"
                                }
                                icon={
                                    step > number
                                        ? <CheckCircle />
                                        : undefined
                                }
                            />

                        )
                    )}

                </Box>


                {/* ================================= */}
                {/* ERREUR */}
                {/* ================================= */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>

                )}


                {/* ================================= */}
                {/* ETAPE 1 */}
                {/* ================================= */}

                {step === 1 && (

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 3,
                            py: 4
                        }}
                    >

                        <CloudUpload
                            sx={{
                                fontSize: 70
                            }}
                        />


                        <Typography variant="h6">
                            Sélectionnez votre
                            fichier de stock
                        </Typography>


                        <Typography
                            color="text.secondary"
                            textAlign="center"
                        >
                            Excel ou CSV contenant
                            les produits de votre stock.
                        </Typography>


                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUpload />}
                        >

                            Choisir un fichier

                            <input
                                hidden
                                type="file"
                                accept=".xls,.xlsx,.csv"
                                onChange={
                                    handleFileChange
                                }
                            />

                        </Button>


                        {file && (

                            <Alert
                                severity="success"
                                sx={{
                                    width: "100%"
                                }}
                            >

                                Fichier sélectionné :

                                <strong>
                                    {" "}
                                    {file.name}
                                </strong>

                            </Alert>

                        )}

                    </Box>

                )}


                {/* ================================= */}
                {/* ETAPE 2 */}
                {/* ================================= */}

                {step === 2 && (

                    <Box>

                        <Typography
                            variant="h6"
                            sx={{ mb: 1 }}
                        >
                            Rayons et familles
                        </Typography>


                        <Typography
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Les catégories déjà connues
                            sont automatiquement pré-remplies.
                            Les nouvelles catégories doivent
                            être renseignées.
                        </Typography>


                        {/* ========================= */}
                        {/* RAYONS */}
                        {/* ========================= */}

                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: "bold",
                                mb: 2
                            }}
                        >
                            Rayons
                        </Typography>


                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2
                            }}
                        >

                            {rayons.map(
                                (rayon) => (

                                    <Box
                                        key={rayon.code}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2
                                        }}
                                    >

                                        <Chip
                                            label={
                                                `Rayon ${rayon.code}`
                                            }
                                        />


                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Nom du rayon"
                                            value={
                                                rayon.name
                                            }
                                            onChange={
                                                (event) =>
                                                    handleRayonChange(
                                                        rayon.code,
                                                        event.target.value
                                                    )
                                            }
                                        />


                                        {rayon.name && (

                                            <CheckCircle
                                                color="success"
                                            />

                                        )}

                                    </Box>

                                )
                            )}

                        </Box>


                        <Divider
                            sx={{ my: 4 }}
                        />


                        {/* ========================= */}
                        {/* FAMILLES */}
                        {/* ========================= */}

                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: "bold",
                                mb: 2
                            }}
                        >
                            Familles
                        </Typography>


                        {rayons.map(
                            (rayon) => {

                                const rayonFamilles =
                                    familles.filter(
                                        (famille) =>
                                            famille.rayonCode ===
                                            rayon.code
                                    );


                                if (
                                    rayonFamilles.length === 0
                                ) {
                                    return null;
                                }


                                return (

                                    <Box
                                        key={rayon.code}
                                        sx={{ mb: 4 }}
                                    >

                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                mb: 1,
                                                fontWeight: "bold"
                                            }}
                                        >

                                            {rayon.name ||
                                                `Rayon ${rayon.code}`}

                                        </Typography>


                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2
                                            }}
                                        >

                                            {rayonFamilles.map(
                                                (famille) => (

                                                    <Box
                                                        key={
                                                            `${famille.rayonCode}-${famille.code}`
                                                        }
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 2
                                                        }}
                                                    >

                                                        <Chip
                                                            // icon={
                                                            //     <Category />
                                                            // }
                                                            label={
                                                                `Famille ${famille.code}`
                                                            }
                                                        />


                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Nom de la famille"
                                                            value={
                                                                famille.name
                                                            }
                                                            onChange={
                                                                (event) =>
                                                                    handleFamilleChange(
                                                                        famille.code,
                                                                        famille.rayonCode,
                                                                        event.target.value
                                                                    )
                                                            }
                                                        />


                                                        {famille.name && (

                                                            <CheckCircle
                                                                color="success"
                                                            />

                                                        )}

                                                    </Box>

                                                )
                                            )}

                                        </Box>

                                    </Box>

                                );

                            }
                        )}

                    </Box>

                )}


                {/* ================================= */}
                {/* ETAPE 3 */}
                {/* ================================= */}

                {step === 3 && (

                    <Box
                        sx={{
                            py: 5,
                            textAlign: "center"
                        }}
                    >

                        <Inventory
                            sx={{
                                fontSize: 70,
                                mb: 2
                            }}
                        />


                        <Typography
                            variant="h6"
                            sx={{ mb: 3 }}
                        >
                            Import du stock
                        </Typography>


                        <Typography
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            {loadingMessage}
                        </Typography>


                        <LinearProgress
                            sx={{
                                height: 8,
                                borderRadius: 4
                            }}
                        />


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            Veuillez patienter,
                            ne fermez pas cette fenêtre.
                        </Typography>

                    </Box>

                )}


                {/* ================================= */}
                {/* ETAPE 4 */}
                {/* ================================= */}

                {step === 4 && (

                    <Box>

                        <Box
                            sx={{
                                textAlign: "center",
                                mb: 4
                            }}
                        >

                            <CheckCircle
                                sx={{
                                    fontSize: 70
                                }}
                            />


                            <Typography
                                variant="h5"
                                sx={{ mt: 2 }}
                            >
                                Import terminé !
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                mb: 3
                            }}
                        >

                            <Typography
                                variant="h6"
                                sx={{ mb: 2 }}
                            >
                                Produits
                            </Typography>


                            <Typography>

                                <strong>
                                    {
                                        importResult?.data?.length ||
                                        0
                                    }
                                </strong>{" "}
                                produits enregistrés.

                            </Typography>

                        </Box>


                        {/* ========================= */}
                        {/* LIGNES IGNOREES */}
                        {/* ========================= */}

                        {importResult?.skippedRows?.length > 0 && (

                            <Box sx={{ mt: 4 }}>

                                <Alert
                                    severity="warning"
                                    sx={{ mb: 3 }}
                                >

                                    <strong>
                                        {
                                            importResult
                                                .skippedRows
                                                .length
                                        }
                                    </strong>{" "}
                                    ligne(s) n'ont pas
                                    été importée(s).

                                </Alert>


                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2 }}
                                >
                                    Lignes ignorées
                                </Typography>


                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        maxHeight: 300,
                                        overflowY: "auto"
                                    }}
                                >

                                    {
                                        importResult
                                            .skippedRows
                                            .map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 1,
                                                            border: "1px solid",
                                                            borderColor:
                                                                "divider",
                                                            bgcolor:
                                                                "action.hover"
                                                        }}
                                                    >

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight:
                                                                    "bold"
                                                            }}
                                                        >
                                                            Ligne Excel :{" "}
                                                            {item.row}
                                                        </Typography>


                                                        {item.articleCode && (

                                                            <Typography
                                                                variant="body2"
                                                            >
                                                                Article :{" "}
                                                                {
                                                                    item.articleCode
                                                                }
                                                            </Typography>

                                                        )}


                                                        {item.name && (

                                                            <Typography
                                                                variant="body2"
                                                            >
                                                                Produit :{" "}
                                                                {
                                                                    item.name
                                                                }
                                                            </Typography>

                                                        )}


                                                        <Typography
                                                            variant="body2"
                                                            color="error"
                                                            sx={{ mt: 0.5 }}
                                                        >
                                                            Raison :{" "}
                                                            {item.reason}
                                                        </Typography>

                                                    </Box>

                                                )
                                            )
                                    }

                                </Box>

                            </Box>

                        )}

                    </Box>

                )}

            </DialogContent>


            {/* ================================= */}
            {/* ACTIONS */}
            {/* ================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                {step !== 3 && (

                    <Button
                        variant="contained"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Annuler
                    </Button>

                )}


                {/* ETAPE 1 */}

                {step === 1 && (

                    <Button
                        variant="contained"
                        disabled={
                            !file ||
                            loading
                        }
                        onClick={handleAnalyze}
                    >

                        {loading
                            ? "Analyse..."
                            : "Continuer"
                        }

                    </Button>

                )}


                {/* ETAPE 2 */}

                {step === 2 && (

                    <Button
                        variant="contained"
                        disabled={
                            loading ||
                            !rayonsValid ||
                            !famillesValid
                        }
                        onClick={
                            handleCategoriesContinue
                        }
                    >

                        Importer le stock

                    </Button>

                )}


                {/* ETAPE 4 */}

                {step === 4 && (

                    <Button
                        variant="contained"
                        onClick={handleClose}
                    >
                        Terminer
                    </Button>

                )}

            </DialogActions>

        </Dialog>

    );
};

export default ImportStock;