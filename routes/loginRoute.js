import {Router} from 'express';

import { logninUser} from "../controllers/loginController.js";

const router = Router();
router.post('/',logninUser);
export default router;