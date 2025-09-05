import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Product = mongoose.model('Product', productSchema);
export default Product;


