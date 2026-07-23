import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#FFFCF2",
        },
        secondary: {
            main: "#F7ECCB",
        },
        third: {
            main: "#E7FBF7",
        }

    },

    components: {
        MuiButton: {
            defaultProps: {
                color: "secondary",
            },
        },
    },
})