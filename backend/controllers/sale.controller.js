import Sale from "../models/sale.model.js";
import Customer from "../models/customer.model.js";
// import Product from "../models/product.model.js";

export const createSale = async (req, res) => {
    try {
        const {
            customer,
            products,
            total,
            cartDiscount,
            paymentMethod
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

        // Création de la vente
        const roundedTotal = Math.round(total * 100) / 100;

        const sale = await Sale.create({
            customer: customer || null,
            products,
            total: roundedTotal,
            cartDiscount,
            paymentMethod
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