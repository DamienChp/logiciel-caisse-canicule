import express from 'express';

import { getCustomer, getOneCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller.js';

const router = express.Router();

router.get("/", getCustomer);
router.get("/:id", getOneCustomer);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;