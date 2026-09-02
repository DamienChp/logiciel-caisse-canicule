import express from 'express';

import { 
    getRayons, 
} from '../controllers/rayon.controller.js';

const router = express.Router();

router.get("/", getRayons);

export default router;