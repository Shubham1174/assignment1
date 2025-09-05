import { validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

async function calculateTotal(products) {
  let total = 0;
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error('Invalid product in order');
    total += product.price * item.quantity;
  }
  return total;
}

export async function createOrder(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { products } = req.body;
  const totalAmount = await calculateTotal(products);
  const order = await Order.create({ userId: req.user.id, products, totalAmount, status: 'pending' });
  res.status(201).json(order);
}

export async function listOrders(req, res) {
  const isAdmin = req.user.role === 'admin';
  const filter = isAdmin ? {} : { userId: req.user.id };
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (req.user.role !== 'admin' && String(order.userId) !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
}

export async function updateOrderStatus(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}


