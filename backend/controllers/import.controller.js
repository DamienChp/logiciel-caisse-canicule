import XLSX from "xlsx";

import Product from "../models/product.model.js";
import Brand from "../models/brand.model.js";
import Famille from "../models/famille.model.js";
import Rayon from "../models/rayon.model.js";

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

export const analyzeImport = async (req, res) => {

    console.log("========== ANALYZE IMPORT ==========");

    try {

        console.log(
            "Fichier reçu :",
            !!req.file
        );


        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Aucun fichier envoyé"
            });

        }


        console.log(
            "Nom fichier :",
            req.file.originalname
        );


        console.log(
            "Taille :",
            req.file.size
        );


        // ==========================================
        // LECTURE DU FICHIER
        // ==========================================

        const workbook = XLSX.read(
            req.file.buffer,
            {
                type: "buffer"
            }
        );


        const sheetName =
            workbook.SheetNames[0];


        const worksheet =
            workbook.Sheets[sheetName];


        const rows =
            XLSX.utils.sheet_to_json(
                worksheet,
                {
                    defval: null
                }
            );


        console.log(
            "Nombre de lignes :",
            rows.length
        );


        // ==========================================
        // DETECTION DES CODES
        // ==========================================

        const rayonsMap = new Map();

        const famillesMap = new Map();


        for (const row of rows) {

            const rayon =
                !isEmpty(row.RAYON)
                    ? String(row.RAYON).trim()
                    : null;


            const famille =
                !isEmpty(row.FAMILLE)
                    ? String(row.FAMILLE).trim()
                    : null;


            if (!rayon) {
                continue;
            }


            // ======================================
            // RAYON
            // ======================================

            if (!rayonsMap.has(rayon)) {

                rayonsMap.set(
                    rayon,
                    {
                        code: rayon,
                        name: ""
                    }
                );

            }


            // ======================================
            // FAMILLE
            // ======================================

            if (famille) {

                const familyKey =
                    `${rayon}-${famille}`;


                if (!famillesMap.has(familyKey)) {

                    famillesMap.set(
                        familyKey,
                        {
                            code: famille,
                            rayonCode: rayon,
                            name: ""
                        }
                    );

                }

            }

        }


        // ==========================================
        // RECUPERATION DES NOMS EXISTANTS
        // ==========================================

        const rayons =
            Array.from(
                rayonsMap.values()
            );


        const familles =
            Array.from(
                famillesMap.values()
            );


        // ==========================================
        // RAYONS DEJA EN BASE
        // ==========================================

        for (const rayon of rayons) {

            const existingRayon =
                await Rayon.findOne({
                    code: rayon.code
                });


            if (existingRayon) {

                rayon.name =
                    existingRayon.name;

            }

        }


        // ==========================================
        // FAMILLES DEJA EN BASE
        // ==========================================

        for (const famille of familles) {

            const rayon =
                await Rayon.findOne({
                    code: famille.rayonCode
                });


            if (!rayon) {
                continue;
            }


            const existingFamille =
                await Famille.findOne({
                    code: famille.code,
                    rayon: rayon._id
                });


            if (existingFamille) {

                famille.name =
                    existingFamille.name;

            }

        }


        // ==========================================
        // LOGS
        // ==========================================

        console.log(
            "Rayons détectés :",
            rayons
        );


        console.log(
            "Familles détectées :",
            familles
        );


        console.log(
            "========== ANALYZE OK ==========");


        // ==========================================
        // REPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            rayons,

            familles

        });


    } catch (error) {

        console.error(
            "========== ANALYZE ERROR =========="
        );


        console.error(error);


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Erreur lors de l'analyse"

        });

    }

};

export const importStock = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Aucun fichier envoyé"

            });
        }

        // ─────────────────────
        // Récupération des correspondances
        // envoyées par le frontend
        // ─────────────────────

        let rayons = [];
        let familles = [];

        try {

            rayons = req.body.rayons
                ? JSON.parse(req.body.rayons)
                : [];

            familles = req.body.familles
                ? JSON.parse(req.body.familles)
                : [];

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: "Les correspondances rayons/familles sont invalides"
            });

        }


        // ─────────────────────
        // Vérification des correspondances
        // ─────────────────────

        if (!Array.isArray(rayons)) {

            return res.status(400).json({
                success: false,
                message: "Les rayons sont invalides"
            });

        }

        if (!Array.isArray(familles)) {

            return res.status(400).json({
                success: false,
                message: "Les familles sont invalides"
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

        // ─────────────────────
        // Maps pour retrouver rapidement
        // les ObjectId MongoDB
        // ─────────────────────

        const rayonMap = new Map();

        const familleMap = new Map();

        // ─────────────────────
        // Création / récupération des rayons
        // ─────────────────────

        for (const rayonData of rayons) {

            if (
                !rayonData.code ||
                !rayonData.name
            ) {
                continue;
            }


            const code = String(rayonData.code).trim();

            const name = String(rayonData.name).trim();

            let rayon = await Rayon.findOne({code});

            // Le rayon n'existe pas
            if (!rayon) {

                rayon = await Rayon.create({
                    code,
                    name
                });

            }

            // Le rayon existe mais son nom a changé
            else if (rayon.name !== name) {

                rayon.name = name;

                await rayon.save();

            }

            rayonMap.set(
                code,
                rayon._id
            );

        }

        // ─────────────────────
        // Création / récupération des familles
        // ─────────────────────

        for (const familleData of familles) {

            if (
                !familleData.code ||
                !familleData.name ||
                !familleData.rayonCode
            ) {
                continue;
            }


            const code = String(familleData.code).trim();

            const rayonCode = String(familleData.rayonCode).trim();

            const name = String(familleData.name).trim();

            const rayonId = rayonMap.get(rayonCode);

            // Le rayon correspondant
            // n'existe pas
            if (!rayonId) {

                continue;

            }


            let famille =
                await Famille.findOne({
                    code,
                    rayon: rayonId
                });


            // La famille n'existe pas
            if (!famille) {

                famille = await Famille.create({
                    code,
                    name,
                    rayon: rayonId
                });

            }

            // La famille existe mais
            // son nom a changé
            else if (famille.name !== name) {

                famille.name = name;

                await famille.save();

            }


            const key =
                `${rayonCode}-${code}`;


            familleMap.set(
                key,
                famille._id
            );

        }


        // ─────────────────────
        // Import des produits
        // ─────────────────────

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

            const familyCode =
                !isEmpty(row.FAMILLE)
                    ? String(row.FAMILLE).trim()
                    : null;


            const rayonCode =
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
            // Récupération des IDs
            // Rayon / Famille
            // ─────────────────────

            const rayonId =
                rayonCode
                    ? rayonMap.get(rayonCode)
                    : null;


            const familleId =
                rayonCode && familyCode
                    ? familleMap.get(
                        `${rayonCode}-${familyCode}`
                    )
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
            // Vérification de la famille
            // ─────────────────────

            if (
                familyCode &&
                rayonCode &&
                !familleId
            ) {

                skippedRows.push({
                    row: rowNumber,
                    articleCode,
                    name,
                    reason:
                        `Famille ${familyCode} du rayon ${rayonCode} introuvable`
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
                        family: familleId || null,
                        rayon: rayonId || null,
                        season,
                        codeTVA
                    });
    
    
                importedProducts.push(newProduct);

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