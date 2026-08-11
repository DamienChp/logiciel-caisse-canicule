import express from "express";

import { 
    createSale, 
    getSaleReceipt,
    sendSaleReceipt
} from "../controllers/sale.controller.js";

const router = express.Router();

router.post("/", createSale);
router.get("/:id/receipt", getSaleReceipt);
router.post("/:id/send-receipt", sendSaleReceipt);

export default router;