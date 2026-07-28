import XLSX from "xlsx";

import Product from "../models/product.model.js";

import Brand from "../models/brand.model.js";


const isEmpty = (value) => {

    return (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    );
};


const parseFrenchNumber = (value) => {

    if (isEmpty(value)) {
        return null;
    }

    const number = Number(
        String(value)
            .replace(",", ".")
            .trim()
    );

    return Number.isNaN(number)
        ? null
        : number;
};


export const importStock = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Aucun fichier envoyé"

            });
        }


        const workbook = XLSX.read(

            req.file.buffer,

            {
                type: "buffer"
            }

        );


        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const rows =
            XLSX.utils.sheet_to_json(

                worksheet,

                {
                    defval: null
                }

            );


        const importedProducts = [];

        const skippedRows = [];

        const createdBrands = [];


        for (
            let index = 0;

            index < rows.length;

            index++
        ) {


            const row = rows[index];
            const rowNumber = index + 2;


            // ─────────────────────
            // Récupération des données
            // ─────────────────────

            const articleCode =
                !isEmpty(row.CODEARTICLE)
                    ? String(row.CODEARTICLE).trim()
                    : null;

            const name =
                !isEmpty(row.DESIGNATION)
                    ? String(row.DESIGNATION).trim()
                    : null;

            const brandName =
                !isEmpty(row.MARQUE)
                    ? String(row.MARQUE).trim()
                    : null;

            const color =
                !isEmpty(row.COULEUR)
                    ? String(row.COULEUR).trim()
                    : null;

            const barcode =
                !isEmpty(row.CODEEAN)
                    ? String(row.CODEEAN).trim()
                    : null;

            const size =
                !isEmpty(row.TAILLE)
                    ? String(row.TAILLE).trim()
                    : null;

            const purchasePrice = parseFrenchNumber(row.PRIXACHAT);

            const priceHT = parseFrenchNumber(row.PVHT);

            const priceTTC = parseFrenchNumber(row.PVTTC);

            const family =
                !isEmpty(row.FAMILLE)
                  ? String(row.FAMILLE).trim()
                    : null;

            const rayon =
                !isEmpty(row.RAYON)
                  ? String(row.RAYON).trim()
                    : null;

            const season =
                !isEmpty(row.SAISON)
                  ? String(row.SAISON).trim()
                    : null;

            const codeTVA =
                !isEmpty(row.codetva)
                  ? String(row.codetva).trim()
                    : null;

            // ─────────────────────
            // Vérification des champs
            // obligatoires
            // ─────────────────────

            if (
                !articleCode ||
                !name ||
                !brandName ||
                priceHT === null
            ) {

                skippedRows.push({
                    row: rowNumber,
                    articleCode,
                    name,
                    brandName,
                    reason: "CODEARTICLE, DESIGNATION ou MARQUE manquant"
                });

                continue;
            }


            // ─────────────────────
            // Recherche ou création de la marque
            // ─────────────────────

            let brand = await Brand.findOne({name: brandName});


            if (!brand) {

                brand = await Brand.create({name: brandName});

                createdBrands.push({
                    name: brand.name,
                    id: brand._id
                });
            }

            // ─────────────────────
            // Suppression des doublons
            // ─────────────────────


            const existingProduct = await Product.findOne({articleCode});

            if (existingProduct) {

                skippedRows.push({
                    row: rowNumber,
                    articleCode,
                    reason: "Produit déjà existant"
                });

                continue;
            }

            // ─────────────────────
            // Créer un nouveau produit
            // ─────────────────────

            try {
                const newProduct = await Product.create({
                        articleCode,
                        name,    
                        brand: brand._id,
                        color,
                        barcode,
                        size,
                        stock: 0,
                        purchasePrice,
                        priceHT,
                        priceTTC,
                        family,
                        rayon,
                        season,
                        codeTVA
                    });
    
    
                importedProducts.push(
    
                    newProduct
    
                );
                //console.log('Produits ajoutés :', newProduct, rowNumber)
            } catch (error) {
                console.error(`Erreur la la ligne ${rowNumber} `, error.message)
                skippedRows.push({
                    row: rowNumber,
                    articleCode: row.CODEARTICLE,
                    name: row.DESIGNATION,
                    reason: error.message
                });

                continue;
            }
        }


        return res.status(201).json({
            success: true,
            message: `${importedProducts.length} lignes traitées`,
            data: importedProducts,
            createdBrands,
            skippedRows

        });


    } catch (error) {

        console.error(
            "Erreur lors de l'import du stock :",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};