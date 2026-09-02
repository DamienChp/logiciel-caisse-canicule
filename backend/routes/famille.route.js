import express from 'express';

import { 
    getFamilles, 
} from '../controllers/famille.controller.js';

const router = express.Router();

router.get("/", getFamilles);

export default router;