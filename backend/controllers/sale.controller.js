import Sale from "../models/sale.model.js";
import Customer from "../models/customer.model.js";
import Counter from "../models/counter.model.js"

import { generateReceiptPDF } from "../services/receipt.service.js";
import { sendReceiptByEmail } from "../services/email.service.js";

export const createSale = async (req, res) => {
    try {
        const {
            customer,
            products,
            total,
            cartDiscount,
            paymentMethod,
            receiptMethod
        } = req.body;

        // Vérification des produits
        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "La vente ne contient aucun produit"
            });
        }

        // Vérification du moyen de paiement
        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Le moyen de paiement est obligatoire"
            });
        }

        // Vérification du total
        if (typeof total !== "number" || total < 0) {
            return res.status(400).json({
                success: false,
                message: "Le total de la vente est invalide"
            });
        }


        // Vérification de la remise panier
        if (
            typeof cartDiscount !== "number" ||
            cartDiscount < 0 ||
            cartDiscount > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "La remise panier est invalide"
            });
        }

        // Si un client est associé à la vente,
        // on vérifie qu'il existe.
        let customerData = null;

        if (customer) {
            customerData = await Customer.findById(customer);

            if (!customerData) {
                return res.status(404).json({
                    success: false,
                    message: "Client introuvable"
                });
            }
        }

        // ==========================================
        // VÉRIFICATION DU REÇU
        // ==========================================

        if (
            receiptMethod &&
            !["email", "phone"].includes(
                receiptMethod
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Le moyen d'envoi du reçu est invalide"
            });

        }

        // ==========================================
        // VÉRIFICATION EMAIL
        // ==========================================

        if (
            receiptMethod === "email" &&
            !customerData?.email
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Ce client ne possède pas d'adresse email"
            });

        }

        // ==========================================
        // VÉRIFICATION TÉLÉPHONE
        // ==========================================

        if (
            receiptMethod === "phone" &&
            !customerData?.phone_number
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Ce client ne possède pas de numéro de téléphone"
            });

        }

        // ==========================================
        // NUMÉRO DE VENTE
        // ==========================================

        const counter = await Counter.findOneAndUpdate(
            { _id: "sale" },
            { $inc: { sequence: 1 } },
            {
                new: true,
                upsert: true
            }
        );

        const saleNumber = counter.sequence;

        // ==========================================
        // ARRONDI DU TOTAL
        // ==========================================

        const roundedTotal = Math.round(total * 100) / 100;

        // ==========================================
        // CRÉATION DE LA VENTE
        // ==========================================

        const sale = await Sale.create({
            saleNumber,

            customer: customer || null,
            products,
            total: roundedTotal,
            cartDiscount,
            paymentMethod,
            receiptMethod: receiptMethod || null
        });

        // Si un client est enregistré,
        // on ajoute le montant de la vente à son cumul.
        if (customerData) {
            customerData.totalSpent = 
                Math.round(
                    (customerData.totalSpent + roundedTotal) * 100
                ) / 100;

            await customerData.save();
        }

        /*
        ==================================================
        DIMINUTION DU STOCK
        À ACTIVER PLUS TARD
        ==================================================

        for (const item of products) {

            // Si le produit possède des tailles,
            // il faudra ici diminuer le stock
            // correspondant à item.size.

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        ==================================================
        */

        /*
        ==================================================
        EMAIL
        À AJOUTER PLUS TARD
        ==================================================

        if (customerData && customerData.email) {

            // envoyer le mail ici

        }

        ==================================================
        */

        res.status(201).json({
            success: true,
            message: "Vente enregistrée avec succès",
            sale
        });

    } catch (error) {

        console.error(
            "Erreur création vente :",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllSales = async (req, res) => {

    try {

        const sales = await Sale
            .find()
            .populate("customer")
            .populate("products.product")
            .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            data: sales

        });

    } catch (error) {

        console.error(
            "Erreur récupération des ventes :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer les ventes"

        });

    }
};

export const getSaleReceipt = async (req, res) => {

    try {

        const { id } = req.params;


        // ==========================================
        // RÉCUPÉRATION DE LA VENTE
        // ==========================================

        const sale = await Sale
            .findById(id)
            .populate("customer")
            .populate("products.product");


        if (!sale) {

            return res.status(404).json({
                success: false,
                message: "Vente introuvable"
            });

        }


        // ==========================================
        // GÉNÉRATION DU PDF
        // ==========================================

        const pdfBuffer = await generateReceiptPDF(sale);


        // ==========================================
        // CONFIGURATION DE LA RÉPONSE
        // ==========================================

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename="recu-canicule-${sale.saleNumber}.pdf"`
        );


        // ==========================================
        // ENVOI DU PDF
        // ==========================================

        res.send(pdfBuffer);

    } catch (error) {

        console.error(
            "Erreur génération reçu :",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Impossible de générer le reçu"

        });

    }
};

export const sendSaleReceipt = async (req, res) => {

    try {

        const { id } = req.params;


        // ==========================================
        // RÉCUPÉRER LA VENTE
        // ==========================================

        const sale = await Sale
            .findById(id)
            .populate("customer")
            .populate("products.product");


        if (!sale) {

            return res.status(404).json({
                success: false,
                message: "Vente introuvable"
            });

        }


        // ==========================================
        // VÉRIFIER LE CLIENT
        // ==========================================

        if (!sale.customer) {

            return res.status(400).json({
                success: false,
                message:
                    "Cette vente n'a pas de client associé"
            });

        }


        // ==========================================
        // VÉRIFIER L'EMAIL
        // ==========================================

        if (!sale.customer.email) {

            return res.status(400).json({
                success: false,
                message:
                    "Ce client n'a pas d'adresse email"
            });

        }


        // ==========================================
        // GÉNÉRER LE PDF
        // ==========================================

        const pdfBuffer = await generateReceiptPDF(sale);


        // ==========================================
        // ENVOYER LE MAIL
        // ==========================================

        await sendReceiptByEmail({
            email: sale.customer.email,
            pdfBuffer,
            saleNumber: sale.saleNumber
        });


        // ==========================================
        // RÉPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Reçu envoyé par email"

        });

    } catch (error) {

        console.error(
            "Erreur envoi reçu :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible d'envoyer le reçu"

        });

    }
};