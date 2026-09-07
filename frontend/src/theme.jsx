import { createTheme } from "@mui/material";

// ======================================================
// PALETTE — couleurs de marque, sans variantes light/dark
// ======================================================

const basePalette = {

    primary: {
        main: "#087EA4"
    },

    secondary: {
        main: "#00A6A6"
    },

    background: {
        default: "#FDF7F2",
        paper: "#FFFFFF"
    },

    text: {
        primary: "#063B5C",
        secondary: "#5A7A8C"
    },

    divider: "#E3E9EC"

};


// ======================================================
// THÈME
// ======================================================

export const theme = createTheme({

    palette: basePalette,

    typography: {

        fontFamily: [
            "Inter",
            "Segoe UI",
            "Roboto",
            "Helvetica",
            "Arial",
            "sans-serif"
        ].join(","),

        // Police de marque réservée aux titres/logo
        // (voir @font-face à déclarer globalement, ex. dans index.css)
        h4: {
            fontFamily: "'Ethnocentric', sans-serif",
            fontWeight: 400,
            letterSpacing: "0.05em"
        }

    },

    shape: {
        borderRadius: 8
    },

    components: {

        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none",
                    fontWeight: 600,
                    paddingTop: 10,
                    paddingBottom: 10
                }
            }
        },

        MuiPaper: {
            defaultProps: {
                elevation: 0
            },
            styleOverrides: {
                root: {
                    backgroundImage: "none"
                }
            }
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8
                }
            }
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 8
                }
            }
        },

        MuiDataGrid: {
            styleOverrides: {

                root: {
                    border: "none",

                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: basePalette.background.default,
                        borderBottom: `1px solid ${basePalette.divider}`
                    },

                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 700,
                        color: basePalette.text.primary
                    },

                    "& .MuiDataGrid-cell": {
                        borderBottom: `1px solid ${basePalette.divider}`,
                        color: basePalette.text.primary
                    },

                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: `${basePalette.primary.main}0F`
                    },

                    "& .MuiDataGrid-footerContainer": {
                        borderTop: `1px solid ${basePalette.divider}`,
                        backgroundColor: basePalette.background.default
                    }

                }

            }
        }

    }

});