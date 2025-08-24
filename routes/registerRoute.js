import{ Router } from 'express';
import {
    registerUser ,
    getUsers,
    deleteUser,
    updateUser,
    getUserById
} from '../controllers/registerController.js';

const router = Router();
router.post('/', registerUser);
router.get('/', getUsers);
router.get('/:id',getUserById);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

export default router;