import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'

import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    Typography,
    TextField,
    Chip,
    Divider,
    Avatar,
    Stack,
    IconButton
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import InventoryIcon from '@mui/icons-material/Inventory2'
import SearchIcon from '@mui/icons-material/Search'

import { useProductStore } from "../../store/product"
import { useFamilleStore } from '../../store/rayonFamille'

const FindProduct = ({ open, onClose }) => {

    // ======================================================
    // PRODUITS
    // ======================================================

    const {
        products,
        getAllProducts
    } = useProductStore();

    const {
        familles, 
        getAllFamilles
    } = useFamilleStore();

    
    useEffect(() => {
        if (open) {
            getAllProducts();
            getAllFamilles();
        }
    }, [open, getAllProducts, getAllFamilles]);
    
    
    // ======================================================
    // ETAT LOCAL
    // ======================================================
    
    const [product, setProduct] = useState(null);
    console.log(product);
    const [lastScan, setLastScan] = useState("");
    const [notFound, setNotFound] = useState(false);

    const familyName = familles.find(
        (item) => String(item._id) === String(product?.family)
    );

    // Réinitialise l'état à chaque ouverture de la modale
    useEffect(() => {
        if (open) {
            setProduct(null);
            setLastScan("");
            setNotFound(false);
        }
    }, [open]);


    // ======================================================
    // RECHERCHE PRODUIT PAR CODE-BARRE
    // ======================================================

    const handleScan = useCallback(
        (value) => {
            const searchValue = String(value)
                .trim()
                .toLowerCase();

            if (!searchValue) return;

            setLastScan(value);

            const found = products.find((p) => {
                const barcode = String(p.barcode ?? "")
                    .trim()
                    .toLowerCase();

                const articleCode = String(p.articleCode ?? "")
                    .trim()
                    .toLowerCase();

                return (
                    barcode === searchValue ||
                    articleCode === searchValue
                );
            });

            if (!found) {
                setProduct(null);
                setNotFound(true);
                return;
            }

            setNotFound(false);
            setProduct(found);
        },
        [products]
    );


    // ======================================================
    // ECOUTE DU SCANNER PHYSIQUE (MODE CLAVIER HID)
    // Actif uniquement quand la modale est ouverte
    // ======================================================

    const barcodeBuffer = useRef("");
    const barcodeTimeout = useRef(null);

    useEffect(() => {

        if (!open) return;

        const handleKeyDown = (event) => {

            // On ignore les frappes faites dans un champ de saisie
            // pour ne pas interférer avec une saisie manuelle
            const tag = event.target.tagName;
            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                event.target.isContentEditable
            ) {
                return;
            }

            if (event.key === "Enter") {

                const barcode = barcodeBuffer.current.trim();

                if (barcode) {
                    handleScan(barcode);
                }

                barcodeBuffer.current = "";
                return;
            }

            if (event.key.length === 1) {

                barcodeBuffer.current += event.key;

                clearTimeout(barcodeTimeout.current);

                barcodeTimeout.current = setTimeout(() => {
                    barcodeBuffer.current = "";
                }, 150);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearTimeout(barcodeTimeout.current);
        };

    }, [open, handleScan]);


    // ======================================================
    // SAISIE MANUELLE (fallback si pas de scanner sous la main)
    // ======================================================

    const handleManualSubmit = (event) => {
        if (event.key === "Enter") {
            handleScan(event.target.value);
        }
    };


    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                Rechercher un article

                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    pb: 3
                }}
            >

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Scanner ou saisir un code-barres ou une référence..."
                    InputProps={{
                        startAdornment: (
                            <SearchIcon
                                sx={{ mr: 1, color: "text.secondary" }}
                            />
                        )
                    }}
                    onKeyDown={handleManualSubmit}
                    autoFocus
                />

                {lastScan && (
                    <Typography variant="caption" color="text.secondary">
                        Dernier scan : {lastScan}
                    </Typography>
                )}

                {notFound && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "error.lighter",
                            border: "1px solid",
                            borderColor: "error.light"
                        }}
                    >
                        <Typography color="error">
                            Aucun article trouvé pour ce code-barres ou cette référence.
                        </Typography>
                    </Paper>
                )}

                {product && (

                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >

                            <Box>
                                <Typography variant="h6">
                                    {product.name || "Nom indisponible"}
                                </Typography>

                                <Chip
                                    label={familyName.name}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>

                        </Stack>

                        <Divider />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 1.5
                            }}
                        >

                            <InfoField
                                label="Code-barres"
                                value={product.barcode}
                            />

                            <InfoField
                                label="Marque"
                                value={product.brand.name}
                            />

                            <InfoField
                                label="Prix"
                                value={
                                    product.priceTTC != null
                                        ? `${Number(product.priceTTC).toFixed(2)} €`
                                        : undefined
                                }
                            />

                            <InfoField
                                label="Stock"
                                value={product.stock}
                            />

                            <InfoField
                                label="Saison"
                                value={product.season}
                            />

                            <InfoField
                                label="Couleur"
                                value={product.color}
                            />

                        </Box>

                    </Paper>

                )}

            </DialogContent>

        </Dialog>
    )
}


// ======================================================
// PETIT COMPOSANT UTILITAIRE POUR AFFICHER UN CHAMP
// ======================================================

const InfoField = ({ label, value }) => (
    <Box>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body1">
            {value !== undefined && value !== null && value !== ""
                ? value
                : "—"}
        </Typography>
    </Box>
);


export default FindProduct