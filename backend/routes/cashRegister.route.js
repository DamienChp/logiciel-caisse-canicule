import express from "express";

import {
    openCashRegister
} from "../controllers/cashRegisterController.js";

const router = express.Router();

router.post(
    "/open",
    openCashRegister
);

export default router;