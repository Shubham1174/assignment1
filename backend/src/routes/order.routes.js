import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createOrder, getOrder, listOrders, updateOrderStatus } from '../controllers/order.controller.js';

const router = Router();

const orderItemValidator = body('products').isArray({ min: 1 }).custom((arr) => {
  for (const item of arr) {
    if (!item.productId || !item.quantity || item.quantity <= 0) return false;
  }
  return true;
});

router.post('/', requireAuth, requireRole('customer'), orderItemValidator, createOrder);
router.get('/', requireAuth, listOrders);
router.get('/:id', requireAuth, param('id').isMongoId(), getOrder);
router.put('/:id/status', requireAuth, requireRole('admin'), [param('id').isMongoId(), body('status').isIn(['pending', 'shipped', 'cancelled'])], updateOrderStatus);

export default router;


