import {Router} from 'express';
import {registerUser, logninUser} from '../controllers/authinticationController.js'

const router = Router();
router.post('/login',logninUser);
router.post('/register',registerUser);
export default router;