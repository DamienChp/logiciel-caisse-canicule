import React, {
    useState
} from "react"


import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from "@mui/material"


import {
    useProductStore
} from "../../../store/product"


const ImportStock = ({ open, onClose, onImportSuccess }) => {

    const [ file, setFile ] = useState(null)
    const [errors, setErrors] = useState([]);
    const [ loading, setLoading ] = useState(false)


    const importStock = useProductStore(
        (state) =>
            state.importStock
    )


    const handleFileChange = (
        event
    ) => {


        const selectedFile =
            event.target.files[0]


        if (!selectedFile) {
            return
        }


        setFile(
            selectedFile
        )
    }


    const handleImport = async () => {


        if (!file) {
            return
        }

        try {

            setLoading(true)

            const result = await importStock(file)

            if (!result.success) {
                console.error(result.message)
                return
            }

            if(result.skippedRows?.length > 0){
                setErrors(result.skippedRows);
            }

            /*
            L'import est terminé
            */

            onImportSuccess();

            if(result.skippedRows.length === 0){
                onClose();
                setFile(null);
            }

        } catch (error) {

            console.error(
                "Erreur lors de l'import :",
                error
            )

        } finally {

            setLoading(false)

        }

    }


    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Importer le stock
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1
                    }}
                >

                    <Typography>
                        Sélectionnez votre fichier
                        Excel ou CSV contenant
                        votre stock.
                    </Typography>

                    <Button
                        variant="contained"
                        component="label"
                    >
                        Sélectionner un fichier
                        <input
                            hidden
                            type="file"
                            accept="
                                .xls,
                                .xlsx,
                                .csv
                            "
                            onChange={handleFileChange}
                        />

                    </Button>
                    {
                        file && (
                            <Typography>
                                Fichier sélectionné :
                                
                                <strong>
                                    {" "}
                                    {
                                        file.name
                                    }
                                </strong>
                            </Typography>
                        )
                    }

                </Box>

            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Annuler
                </Button>

                <Button
                    variant="contained"
                    disabled={
                        !file ||
                        loading
                    }
                    onClick={handleImport}
                >

                    {
                        loading
                            ? "Import en cours..."
                            : "Importer"
                    }

                </Button>

            </DialogActions>

        </Dialog>

    )

}


export default ImportStock