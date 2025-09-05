import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '../controllers/product.controller.js';

const router = Router();

const idParam = [param('id').isMongoId()];

const createValidators = [
  body('name').isString().isLength({ min: 2 }),
  body('description').isString().isLength({ min: 2 }),
  body('price').isFloat({ gt: 0 }),
  body('category').isString().isLength({ min: 2 })
];

const updateValidators = [
  body('name').optional().isString().isLength({ min: 2 }),
  body('description').optional().isString().isLength({ min: 2 }),
  body('price').optional().isFloat({ gt: 0 }),
  body('category').optional().isString().isLength({ min: 2 })
];

router.post('/', requireAuth, requireRole('admin'), createValidators, createProduct);
router.get('/', listProducts);
router.get('/:id', idParam, getProduct);
router.put('/:id', requireAuth, requireRole('admin'), idParam.concat(updateValidators), updateProduct);
router.delete('/:id', requireAuth, requireRole('admin'), idParam, deleteProduct);

export default router;


