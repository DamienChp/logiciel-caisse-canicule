import express from "express";

import { openCashRegister } from "../controllers/cashRegister.controller.js";

const router = express.Router();

router.post(
    "/open",
    openCashRegister
);

export default router;