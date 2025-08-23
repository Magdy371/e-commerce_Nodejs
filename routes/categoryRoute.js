import {Router} from 'express';
import {
    createCategory,
    getCategories,
    findByName,
    findBy_Id,
    deleteCategory,
    updateCategory
} from '../controllers/categoryController.js'

const router = Router();
router.post('/',createCategory);
router.get('/',getCategories);
router.get('/name/:name',findByName);
router.get('/id/:id',findBy_Id);
router.put('/:id',updateCategory);
router.delete('/:id',deleteCategory);

export default router;