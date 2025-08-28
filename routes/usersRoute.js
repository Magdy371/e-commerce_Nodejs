import{ Router } from 'express';
import {
    getUsers,
    deleteUser,
    updateUser,
    getUserById
} from '../controllers/usersController.js';

const router = Router();
router.get('/', getUsers);
router.get('/:id',getUserById);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

export default router;