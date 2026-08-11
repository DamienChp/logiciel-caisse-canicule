import express from "express";

import { createSale, getSaleReceipt } from "../controllers/sale.controller.js";

const router = express.Router();

router.post("/", createSale);
router.get("/:id/receipt", getSaleReceipt);


export default router;