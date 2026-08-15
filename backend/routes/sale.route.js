import express from "express";

import { 
    createSale, 
    getSaleReceipt,
    sendSaleReceipt,
    getAllSales
} from "../controllers/sale.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Toutes les routes de vente nécessitent d'être connecté
router.use(protectRoute);

router.post("/", createSale);
router.get("/", getAllSales);
router.get("/:id/receipt", getSaleReceipt);
router.post("/:id/send-receipt", sendSaleReceipt);

export default router;