import express from 'express';
import multer from 'multer';

import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { importStock } from '../controllers/import.controller.js';

const router = express.Router();

const uploadStock = multer({ storage: multer.memoryStorage()}) 

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.post("/import", uploadStock.single("file"), importStock)

export default router;