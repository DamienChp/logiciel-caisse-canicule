// import { createTheme } from "@mui/material";

// export const theme = createTheme({
//     palette: {
//         primary: {
//             main: "#F7ECCB",
//         },
//         secondary: {
//             main: "#FFFCF2",
//         },
//         third: {
//             main: "#E7FBF7",
//         }

//     }
// })

import { createTheme } from "@mui/material";

// ======================================================
// PALETTE DE BASE
// ======================================================
// On garde ton identité (tons crème / doré chaud + accent menthe),
// mais avec des teintes light/dark cohérentes et du texte lisible.

const basePalette = {

    primary: {
        main: "#D9A441",      // doré chaud, plus affirmé que le beige pâle d'origine
        light: "#F7ECCB",     // ton beige d'origine devient la teinte claire
        dark: "#B3822E",
        contrastText: "#2B2114"
    },

    secondary: {
        main: "#2B2114",      // brun très foncé, sert pour le texte fort / contraste
        light: "#FFFCF2",     // ton blanc cassé d'origine
        dark: "#1A140C",
        contrastText: "#FFFCF2"
    },

    third: {
        main: "#4FB3A9",      // menthe plus saturée, plus lisible que #E7FBF7
        light: "#E7FBF7",
        dark: "#357F78",
        contrastText: "#0B2B28"
    },

    success: {
        main: "#4CAF7D"
    },

    warning: {
        main: "#E0A93E"
    },

    error: {
        main: "#D9534F"
    },

    background: {
        default: "#FBF8F0",   // fond légèrement chaud, plus doux qu'un blanc pur
        paper: "#FFFFFF"
    },

    text: {
        primary: "#2B2114",
        secondary: "#7A6E5A"
    },

    divider: "#EAE2CE"

};


// ======================================================
// THÈME
// ======================================================

export const theme = createTheme({

    palette: basePalette,


    // ==================================================
    // TYPOGRAPHIE
    // ==================================================

    typography: {

        fontFamily: [
            "Inter",
            "Segoe UI",
            "Roboto",
            "Helvetica",
            "Arial",
            "sans-serif"
        ].join(","),

        h4: {
            fontWeight: 700,
            letterSpacing: "-0.02em"
        },

        h6: {
            fontWeight: 700
        },

        subtitle1: {
            fontWeight: 600
        },

        button: {
            fontWeight: 600,
            // textTransform: "none"
        }

    },


    // ==================================================
    // FORME (arrondis cohérents partout)
    // ==================================================

    shape: {
        borderRadius: 7
    },


    // ==================================================
    // COMPOSANTS
    // ==================================================

    components: {

        // -------------------------------------------
        // BOUTONS
        // -------------------------------------------

        MuiButton: {

            defaultProps: {
                disableElevation: true
            },

            styleOverrides: {

                root: {
                    backgroundColor: basePalette.primary.light,
                    borderRadius: 7,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 18,
                    paddingRight: 18
                },

                containedPrimary: {
                    boxShadow: "none",

                    "&:hover": {
                        boxShadow: "none",
                        backgroundColor: "#C4933A"
                    }

                }

            }

        },


        // -------------------------------------------
        // PAPER / CARTES
        // -------------------------------------------

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


        // -------------------------------------------
        // BARRE DE NAVIGATION
        // -------------------------------------------

        MuiAppBar: {

            styleOverrides: {

                root: {
                    backgroundColor: "#FFFCF2",
                    color: "#2B2114",
                    boxShadow: "none",
                    borderBottom: "1px solid #EAE2CE"
                }

            }

        },


        // -------------------------------------------
        // CHAMPS DE TEXTE
        // -------------------------------------------

        MuiOutlinedInput: {

            styleOverrides: {

                root: {
                    borderRadius: 10
                }

            }

        },


        // -------------------------------------------
        // CHIP
        // -------------------------------------------

        MuiChip: {

            styleOverrides: {

                root: {
                    fontWeight: 600,
                    borderRadius: 8
                }

            }

        },


        // -------------------------------------------
        // TABLEAU DE DONNÉES (DataGrid)
        // -------------------------------------------

        MuiDataGrid: {

            styleOverrides: {

                root: {
                    border: "none",

                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#FBF8F0",
                        borderBottom: "1px solid #EAE2CE"
                    },

                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #F2ECDD"
                    },

                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#FBF8F0"
                    }

                }

            }

        }

    }

});